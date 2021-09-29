const keys = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'A100', 'A200', 'A400', 'A700'];
function hexToRgba(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : {};
}
function renderPalettes(mcp, nodes) {
    for (let i = 0, len = mcp.showAccents ? keys.length : keys.length - 4; i < len; i++) {
        let ptype;
        switch (mcp.selectType) {
            case 'c':
                ptype = mcp.palette['complementary'];
                break;
            case 'a1':
                ptype = mcp.palette['analogous']['primary'];
                break;
            case 'a2':
                ptype = mcp.palette['analogous']['secondary'];
                break;
            case 't1':
                ptype = mcp.palette['triadic']['primary'];
                break;
            case 't2':
                ptype = mcp.palette['triadic']['secondary'];
                break;
            case 'p':
            default:
                ptype = mcp.palette['primary'];
                break;
        }
        const palette = hexToRgba(ptype[keys[i]]);
        let rect = figma.createRectangle();
        rect.name = i < 10 ? `${mcp.paletteName} / ${keys[i]}` : `${mcp.paletteName} / ${keys[i]}`;
        rect.x = i * 100;
        rect.y = 100 * mcp.clicks;
        rect.fills = [
            {
                type: 'SOLID',
                color: {
                    r: palette.r / 255,
                    g: palette.g / 255,
                    b: palette.b / 255,
                },
            },
        ];
        if (mcp.makeStyles) {
            let existingLocalStyles = figma.getLocalPaintStyles().filter(paintStyle => paintStyle.name === rect.name);
            if (existingLocalStyles.length !== 0) existingLocalStyles[0].remove();
            let newStyle = figma.createPaintStyle();
            newStyle.name = rect.name;
            newStyle.description = `${ptype[keys[i]].toUpperCase()}\nRGB(${palette.r},${palette.g},${palette.b})`;
            newStyle.paints = [
                {
                    type: 'SOLID',
                    color: {
                        r: palette.r / 255,
                        g: palette.g / 255,
                        b: palette.b / 255,
                    },
                },
            ];
            rect.fillStyleId = newStyle.id;
        }

        figma.currentPage.appendChild(rect);
        nodes.push(rect);
    }
}
figma.showUI(__html__, {
    width: 310,
    height: 410,
});
figma.ui.onmessage = data => {
    switch (data.type) {
        case 'create-palette':
            // holds the complete response object with form data
            const mcp = data.response;
            // build color palette rectangles
            const nodes = [];
            renderPalettes(mcp, nodes);
            figma.currentPage.selection = nodes;
            figma.viewport.scrollAndZoomIntoView(nodes);
            break;
        case 'cancel':
            figma.closePlugin();
            break;
    }
};

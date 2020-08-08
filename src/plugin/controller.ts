const keys = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'A100', 'A200', 'A400', 'A700'];
figma.showUI(__html__, {
    width: 265,
    height: 370,
});
figma.ui.onmessage = data => {
    switch (data.type) {
        case 'create-palette':
            // holds the complete response object with form data
            const mcp = data.response;
            // build color palette rectangles
            const nodes = [];
            for (let i = 0, len = mcp.showAccents ? keys.length : keys.length - 4; i < len; i++) {
                const primaryPalette = mcp.palette.primary[keys[i]];
                let rect = figma.createRectangle();
                rect.name =
                    i < 10
                        ? `${mcp.paletteName} / Primary / Colors / ${keys[i]}`
                        : `${mcp.paletteName} / Primary / Accents / ${keys[i]}`;
                rect.x = i * 100;
                rect.y = 100 * mcp.clicks;
                rect.fills = [
                    {
                        type: 'SOLID',
                        color: {
                            r: primaryPalette.rgb.r / 255,
                            g: primaryPalette.rgb.g / 255,
                            b: primaryPalette.rgb.b / 255,
                        },
                    },
                ];
                if (mcp.makeStyles) {
                    let existingLocalStyles = figma
                        .getLocalPaintStyles()
                        .filter(paintStyle => paintStyle.name === rect.name);
                    if (existingLocalStyles.length !== 0) existingLocalStyles[0].remove();
                    let newStyle = figma.createPaintStyle();
                    newStyle.name = rect.name;
                    newStyle.description = `${primaryPalette.hex.toUpperCase()}\n${primaryPalette.rgb.string}\n${primaryPalette.hsl.string}\n${primaryPalette.cymk.string}`;
                    newStyle.paints = [
                        {
                            type: 'SOLID',
                            color: {
                                r: primaryPalette.rgb.r / 255,
                                g: primaryPalette.rgb.g / 255,
                                b: primaryPalette.rgb.b / 255,
                            },
                        },
                    ];
                    rect.fillStyleId = newStyle.id;
                }

                figma.currentPage.appendChild(rect);
                nodes.push(rect);
            }
            if (mcp.showComplementary) {
                for (let i = 0, len = mcp.showAccents ? keys.length : keys.length - 4; i < len; i++) {
                    const complementaryPalette = mcp.palette.secondary[keys[i]];
                    let rect = figma.createRectangle();
                    rect.x = i * 100;
                    rect.name =
                        i < 10
                            ? `${mcp.paletteName} / Complementary / Colors / ${keys[i]}`
                            : `${mcp.paletteName} / Complementary / Accents / ${keys[i]}`;
                    rect.y = 100 * (mcp.clicks + 1);
                    rect.fills = [
                        {
                            type: 'SOLID',
                            color: {
                                r: complementaryPalette.rgb.r / 255,
                                g: complementaryPalette.rgb.g / 255,
                                b: complementaryPalette.rgb.b / 255,
                            },
                        },
                    ];
                    if (mcp.makeStyles) {
                        let existingLocalStyles = figma
                        .getLocalPaintStyles()
                        .filter(paintStyle => paintStyle.name === rect.name);
                        if (existingLocalStyles.length !== 0) existingLocalStyles[0].remove();
                        let newStyle = figma.createPaintStyle();
                        newStyle.name = rect.name;
                        newStyle.description = `${complementaryPalette.hex.toUpperCase()}\n${complementaryPalette.rgb.string}\n${complementaryPalette.hsl.string}\n${complementaryPalette.cymk.string}`;
                        newStyle.paints = [
                            {
                                type: 'SOLID',
                                color: {
                                    r: complementaryPalette.rgb.r / 255,
                                    g: complementaryPalette.rgb.g / 255,
                                    b: complementaryPalette.rgb.b / 255,
                                },
                            },
                        ];
                        rect.fillStyleId = newStyle.id;
                    }

                    figma.currentPage.appendChild(rect);
                    nodes.push(rect);
                }
            }
            figma.currentPage.selection = nodes;
            figma.viewport.scrollAndZoomIntoView(nodes);
            break;
        case 'cancel':
            figma.closePlugin();
            break;
    }
};

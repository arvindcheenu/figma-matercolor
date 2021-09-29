import * as React from 'react';
import Matercolor from 'matercolors';
import {useForm} from 'react-hook-form';
import '../styles/ui.css';
const validateHex = hexcolor => {
    let color = hexcolor.charAt(0) !== '#' ? hexcolor : hexcolor.substring(1);
    if (color.length === 3) {
        return (
            '#' +
            color
                .toUpperCase()
                .split('')
                .map(function(hex) {
                    return hex + hex;
                })
                .join('')
        );
    }
    return hexcolor.charAt(0) !== '#' ? '#' + hexcolor.toUpperCase() : hexcolor.toUpperCase();
};
const App = () => {
    // Import the App Logo
    const logo = require('../assets/logo.svg');
    // keep track of button clicks
    const [clicks, setClicks] = React.useState(0);
    // Form Registration and Handling Actions
    const {register, handleSubmit, watch, getValues, setValue} = useForm({
        defaultValues: {
            paletteName: 'My Cool Palette',
            hexColor: '#00BFD8',
            hexName: '#00BFD8',
            showAccents: false,
            selectType: 'p',
            makeStyles: false,
        },
    });
    const watchColor = watch('hexColor');
    const watchName = watch('hexName');
    // Send your data to Figma UI for processing
    const createPalette = handleSubmit(data => {
        const complementary = getValues('showComplementary');
        setClicks(complementary ? clicks + 2 : clicks + 1);
        let response = Object.assign({}, data);
        response['palette'] = new Matercolor(response.hexColor).palette;
        response['clicks'] = clicks;
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'create-palette',
                    response,
                },
            },
            '*'
        );
    });
    // Ask Figma UI to execute Cancel Operation
    const onCancel = handleSubmit(() => {
        parent.postMessage(
            {
                pluginMessage: {
                    type: 'cancel',
                },
            },
            '*'
        );
    });
    // Listen to Figma UI's response to your data
    React.useEffect(() => {
        window.onmessage = event => {
            const {type, message} = event.data.pluginMessage;
            if (type === 'create-palette') {
                console.log(`Figma Says: ${message}`);
            }
        };
    }, []);
    return (
        <div className="flex column flex-wrap ml-xsmall mr-xxxsmall">
            <div className="flex-grow p-xsmall align-self-center">
                <img src={logo} />
            </div>
            <form className="flex-grow p-xxsmall align-self-center">
                <label className="section-title" htmlFor="paletteName">
                    Name your Palette
                </label>
                <div className="flex align-self-center mr-xxsmall">
                    <input
                        className="input__field flex-grow"
                        id="paletteName"
                        type="text"
                        name="paletteName"
                        ref={register}
                    />
                </div>
                <label className="section-title" htmlFor="hexColor">
                    Hex Color
                </label>
                <div className="flex align-self-center mr-xxsmall">
                    <input
                        className="input__field"
                        style={{width: 32}}
                        id="hexColor"
                        type="color"
                        name="hexColor"
                        ref={register}
                        onChange={e => watchColor && setValue('hexName', validateHex(e.target.value))}
                    />
                    <input
                        className="input__field flex-grow"
                        id="hexName"
                        type="text"
                        name="hexName"
                        ref={register}
                        onChange={e => watchName && setValue('hexColor', validateHex(e.target.value))}
                    />
                </div>
                <label className="section-title" htmlFor="selectType">
                    Palette Type
                </label>
                <div className="flex align-self-center mr-xxsmall">
                    <select
                        id="selectType"
                        name="selectType"
                        className="select-menu select-menu__button"
                        ref={register}
                    >
                        <option value="p">Primary</option>
                        <option value="c">Complementary</option>
                        <option value="a1">Analogous Primary</option>
                        <option value="a2">Analogous Secondary</option>
                        <option value="t1">Triadic Primary</option>
                        <option value="t2">Triadic Secondary</option>
                    </select>
                </div>
                <label className="section-title">Optional Features</label>
                <div className="flex align-self-center mr-xxsmall">
                    <div className="checkbox">
                        <input
                            name="showAccents"
                            id="showAccents"
                            type="checkbox"
                            className="checkbox__box"
                            ref={register}
                        />
                        <label htmlFor="showAccents" className="checkbox__label">
                            Make Accents
                        </label>
                    </div>
                    <div className="checkbox">
                        <input
                            name="makeStyles"
                            id="makeStyles"
                            type="checkbox"
                            className="checkbox__box"
                            ref={register}
                        />
                        <label htmlFor="makeStyles" className="checkbox__label">
                            Make Paint Styles
                        </label>
                    </div>
                </div>
                <div className="flex align-self-center mt-xsmall w-100">
                    <button className="button button--primary-destructive mr-xsmall w-30" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="button button--primary w-60" onClick={createPalette}>
                        Create Palette
                    </button>
                </div>
            </form>
        </div>
    );
};
export default App;

import * as React from 'react';
import mc from 'matercolors';
import {useForm} from 'react-hook-form';
import '../styles/ui.css';

const App = () => {
    // Import the App Logo
    const logo = require('../assets/logo.svg');
    // keep track of button clicks
    const [clicks, setClicks] = React.useState(0);
    // Form Registration and Handling Actions
    const {register, handleSubmit, watch, getValues} = useForm({
        defaultValues: {
            paletteName: 'My Cool Palette',
            hexColor: '#00BFD8',
            showAccents: false,
            showComplementary: false,
            makeStyles: false,
        },
    });
    const watchColor = watch('hexColor');
    // Send your data to Figma UI for processing
    const createPalette = handleSubmit(data => {
        const complementary = getValues('showComplementary');
        setClicks(complementary ? clicks + 2 : clicks + 1);
        let response = Object.assign({}, data);
        response['palette'] = new mc(response.hexColor).palette();
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
                <input className="input__field w-90" id="paletteName" type="text" name="paletteName" ref={register} />
                <div className="flex align-self-center mr-xxsmall">
                    <label className="section-title" htmlFor="hexColor">
                        Hex Color
                    </label>
                    <input className="input__field" id="hexColor" type="color" name="hexColor" ref={register} />
                    <span className="flex align-self-center ml-xxxsmall mr-xsmall type--small text-upper">
                        {getValues('hexColor') ? watchColor && getValues('hexColor').substring(1) : '00BFD8'}
                    </span>
                </div>
                <label className="section-title" htmlFor="additionalPalettes">
                    Additional Palettes
                </label>
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
                            Accents
                        </label>
                    </div>
                    <div className="checkbox">
                        <input
                            name="showComplementary"
                            id="showComplementary"
                            type="checkbox"
                            className="checkbox__box"
                            ref={register}
                        />
                        <label htmlFor="showComplementary" className="checkbox__label">
                            Complementary
                        </label>
                    </div>
                </div>
                <label className="section-title" htmlFor="makeStyles">
                    Optional Features
                </label>
                <div className="checkbox">
                    <input name="makeStyles" id="makeStyles" type="checkbox" className="checkbox__box" ref={register} />
                    <label htmlFor="makeStyles" className="checkbox__label">
                        Generate Paint Styles for Palette
                    </label>
                </div>
                <div className="flex row flex-no-wrap mt-xxsmall">
                    <button className="button button--primary-destructive mr-xxsmall" onClick={onCancel}>
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

import React, { Fragment } from 'react';
import { A, As, B, C, Cs, D, Ds, E, F, Fs, G, Gs } from '../audio';
import { FaKeyboard } from 'react-icons/fa';

class Piano extends React.Component {
    constructor(props) {
        super(props);
        this.state = { settings: false };
        this.notes = [C, D, E, F, G, A, B, Cs, Ds, Fs, Gs, As];
        this.nKeys = ['S', 'D', 'F', 'G', 'H', 'J', 'K'];
        this.nKeyCodes = ['83', '68', '70', '71', '72', '74', '75'];
        this.sKeys = ['E', 'R', 'Y', 'U', 'I'];
        this.sKeyCodes = ['69', '82', '89', '85', '73'];
    }

    createNaturals = () => {
        return this.nKeyCodes.map((current, i) => {     
            return (<div data-key={current} className={`key n`}>
                        <p style={{visibility: this.state.settings ? 'visible' : 'hidden' }} 
                           data-n={this.nKeys[i]}>
                        </p>
                    </div>);
        });
    }

    createSharps = () => {
        return (
            <Fragment>
                <div className="null"></div>
                    {this.sKeyCodes.map((current, i) => {     
                        return (<Fragment>
                                    <div data-key={current} className={`key s`}>
                                        <p style={{visibility: this.state.settings ? 'visible' : 'hidden' }} 
                                           data-s={this.sKeys[i]}>
                                        </p>
                                    </div>
                                    <div className="null"></div>
                                    {(() => {
                                        if(i === 1){
                                            return <div className="null"></div>;
                                        }
                                    })()}
                                </Fragment>);
                    })}
            </Fragment>
        );
    }

    createAudios = () => {
        const keyCodes = [...this.nKeyCodes, ...this.sKeyCodes];
        return this.notes.map((current, i) => {     
            return <audio data-key={keyCodes[i]} src={current}></audio>;
        });
    }
    
    render() {
        return (
            <div className="piano">
                <FaKeyboard 
                    onMouseEnter={e => this.setState({ settings: true })} 
                    onMouseLeave={e => this.setState({ settings: false })} 
                    className="icon-keyboard" 
                    size={40}
                />
                <div className="naturals">
                    {this.createNaturals()}
                </div>
                <div className="sharps">
                    {this.createSharps()}
                </div>
                {this.createAudios()}
            </div>
        );
    }
}

export default Piano;
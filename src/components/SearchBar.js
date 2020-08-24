import React from 'react';

class SearchBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = { keyword: '' };
    }
        onFormSubmit = e => {
            e.preventDefault();
            this.props.onSubmit(this.state.keyword);
        };

        setFocus = () => {
            this.props.getFormStatus(true);
        }

        setUnfocus = () => {
            this.props.getFormStatus(false);
        }

    render() {
        return (
            <div>
                <form onSubmit={this.onFormSubmit} className="form">
                    <div>
                        <input 
                            className="field-form"
                            onFocus={this.setFocus}
                            onBlur={this.setUnfocus}
                            type="text" 
                            value={this.state.keyword.toUpperCase()}
                            placeholder="SEARCH WALLPAPER"
                            onChange={e => this.setState({ keyword: e.target.value })}
                        />
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchBar;
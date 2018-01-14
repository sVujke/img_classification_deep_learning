import React, { Component } from 'react';
import { TextField, ButtonBase, Paper } from 'material-ui';
import SearchIcon from 'material-ui-icons/Search';
import PropTypes from 'prop-types';

const SEARCH_TEXT_FIELD_PALCEHOLDER_TEXT = 'Search';

export default class SearchBar extends Component {
    
    handleOnKeyDown = (event) => {
        switch (event.key) {
            case 'Enter':
                this.props.onClick();
                break
            case 'Escape':
                // etc...
                break
            default: break
        }
    }

    handleOnChange = (event) => {
        this.props.onChange(event.target.value);
    }

    render () {
        return (
            <Paper elevation={2} style={searchBarDefaultStyles.paper}>
                <div style={searchBarDefaultStyles.container}>
                    <div style={searchBarDefaultStyles.searchTextFieldContainer}>
                        <TextField
                            autoFocus
                            fullWidth
                            placeholder={SEARCH_TEXT_FIELD_PALCEHOLDER_TEXT}
                            value={this.props.searchTextValue}
                            onKeyDown={event => this.handleOnKeyDown(event)}
                            onChange={event => this.handleOnChange(event)}
                            InputProps={{
                                disableUnderline: true,
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            //Will generate "No duplicate props allowed  react/jsx-no-duplicate-props" but these are two different props!
                            inputProps={{
                                minLength: 1,
                                maxLength: 100
                            }}
                        />
                    </div>
                    <div style={searchBarDefaultStyles.searchButtonContainer}>
                        <ButtonBase style={searchBarDefaultStyles.searchButton} onClick={event => this.props.onClick(event)}>
                            <SearchIcon />
                        </ButtonBase>
                    </div>
                </div>
            </Paper>
        );
    }
}

SearchBar.propTypes={
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    searchTextValue: PropTypes.string
}

const searchBarDefaultStyles = {
    paper: {
        
    },
    container: {
        padding: 4,
        margin: 0,
        width: '100%',
        display: 'flex',
        flexFlow: 'row'
    },
    searchTextFieldContainer: {
        marginLeft: 8,
        marginRight: 4,
        width: '100%',
        flex: '1 1 auto'
    },
    searchButtonContainer: {
        flex: '0 1 32px',
        marginLeft: 4,
        marginRight: 8
    },
    searchButton: {
        color: 'rgb(66,133,244)',
        height: 32
    }
}
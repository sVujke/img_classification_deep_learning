import React, { Component } from 'react';
import {Grid, TextField, ButtonBase, Paper } from 'material-ui';
import SearchIcon from 'material-ui-icons/Search';
import PropTypes from 'prop-types';

const SEARCH_TEXT_FIELD_PALCEHOLDER_TEXT = 'Search...';

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

    render () {
        return (
            <Paper>
                <Grid 
                container 
                direction='row' 
                justify='flex-start' 
                alignItems='center' 
                spasing={2}
                style={searchBarDefaultStyles.gridContainer}>
                    <Grid item xs={9} style={{padding:0}}>
                        <TextField
                            style={searchBarDefaultStyles.searchTextField}
                            placeholder={SEARCH_TEXT_FIELD_PALCEHOLDER_TEXT}
                            onKeyDown={event => this.handleOnKeyDown(event)}
                        />
                    </Grid>
                    <Grid item xs={3} style={{padding:0}}>
                        <ButtonBase style={searchBarDefaultStyles.searchButton} onClick={event => this.props.onClick(event)}>
                            <SearchIcon />
                        </ButtonBase>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

SearchBar.propTypes={
    onClick: PropTypes.func
}

const searchBarDefaultStyles = {
    gridContainer: {
        padding: 4,
        margin: 0,
        width: '100%'
    },
    searchTextField: {
        padding: 0,
        margin: 'none',
        width: '100%'
    },
    searchButton: {
        color: 'black',
        padding: 0
    }
}
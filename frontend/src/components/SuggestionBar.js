import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';

export default class SuggestionBar extends Component {

    render() {
        return (
            <div style={this.props.style}>
                {this.props.synonyms.map((obj, key) => {
                    return (<Button key={key} onClick={() => this.props.onClick(obj)} disableRipple style={suggestionBarDefaultStyles.buttonStyle} variant="raised">
                        {obj}
                    </Button>)
                })}
            </div>
        );
    }

}

SuggestionBar.propTypes = {
    style: PropTypes.object,
    synonyms: PropTypes.array,
    onElementClick: PropTypes.func
}

const suggestionBarDefaultStyles = {
    buttonStyle: {
        padding: 6,
        backgroundColor: '#009587',
        color: '#CFEAE7',
        marginRight: 5,
        marginBottom: 5,
        textTransform: "none",
        fontWeight: 'normal',
        boxShadow: '1px 2px 4px rgba(0,0,0,0.5)'

    },
    buttonStyleSelected: {
        padding: 6,
        backgroundColor: '#FFFFFF',
        color: '#757575',
        marginRight: 5,
        textTransform: "none",
        fontWeight: 'normal',
        boxShadow: '1px 2px 3px rgba(0,0,0,0.5)'
    },
    cancelIconStyle: {
        marginLeft: 8,
        width: 18,
        height: 18
    }
}


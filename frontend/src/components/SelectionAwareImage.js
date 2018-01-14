import CheckCircle from 'material-ui-icons/CheckCircle';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class ImageGrid extends Component {

    render() {
        return (
            <div>
                <img
                    src={this.props.imageSrc}
                    alt={this.props.alt}
                    style={this.props.style}
                />
                {this.props.selected ? <CheckCircle style={selectionAwareImageDefaultStyles.checkmarkStyle}/> : null} 
            </div>
        );
    }
}

const selectionAwareImageDefaultStyles = {
    checkmarkStyle: {
        color: 'green',
        zIndex: 100,
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 20,
        float: 'right',
        right: 10
    },

}

ImageGrid.propTypes = {
    imageSrc: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    style: PropTypes.object,
    alt: PropTypes.string
}


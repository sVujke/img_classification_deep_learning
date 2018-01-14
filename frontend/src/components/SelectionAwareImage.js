import CheckCircle from 'material-ui-icons/CheckCircle';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class ImageGrid extends Component {

    render() {
        return (
            <div style={selectionAwareImageDefaultStyles.containerStyle}>
                <img
                    src={require(`../mlimages/${this.props.imageSrc}`)}
                    alt={this.props.alt}
                    style={selectionAwareImageDefaultStyles.imageStyle} 
                />
                {this.props.selected ? <CheckCircle style={selectionAwareImageDefaultStyles.checkmarkStyle}/> : null} 
            </div>

        );
    }
}

const selectionAwareImageDefaultStyles = {
    containerStyle: {
        width: '100%',
        height: '100%'
    },
    checkmarkStyle: {
        color: 'green',
        zIndex: 100,
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 20,
        right: 10,
        top: 10
    },
    imageStyle: {
        maxWidth: '100%',
        maxHeight: '100%',
        margin: 'auto',
        display: 'block',
        objectFit: 'contain'
    }
}

ImageGrid.propTypes = {
    imageSrc: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    style: PropTypes.object,
    alt: PropTypes.string
}


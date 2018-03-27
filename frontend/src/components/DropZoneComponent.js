import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone'
import { Typography, Grid } from 'material-ui'
import { placeholderBase64 } from '../assets/placeholderBase64'


export default class DropZoneComponent extends Component {

    render () {
        const {
            dropZone,
            dropZoneContent,
            dropZoneText,
            dropZoneTextSmall,
            dropZoneImage
        } = dropZoneComponentDefaultStyles;
        return (
            <div style={this.props.style}>
                <Dropzone
                    style={dropZone}
                    multiple={false}
                    disabled={this.props.disabled}
                    disablePreview
                    accept='.jpeg, .png, .jpg'
                    maxSize={1024 * 1024 * 4}
                    onDrop={(a, r) => this.props.onDrop(a,r)}>
                    <Grid style={dropZoneContent} container spacing={8} direction='row' justify='space-between' alignItems='center'>
                        <Grid item xs={12} sm={8}>
                            <Typography style={dropZoneText}>Drag image file here or</Typography>
                            <Typography style={dropZoneText}>Browse from your computer</Typography>
                            <Typography style={dropZoneTextSmall}>Supported: .jpeg, .png &le; 4 MB</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <img alt='img' src={this.props.base64image != null ? this.props.base64image : placeholderBase64} style={dropZoneImage}/>
                        </Grid>
                    </Grid>
                </Dropzone>
            </div>
        );
    }

}
DropZoneComponent.propTypes = {
    style: PropTypes.object,
    onDrop: PropTypes.func,
    base64image: PropTypes.string,
    disabled: PropTypes.bool
}
const dropZoneComponentDefaultStyles = {
    dropZone: {
        border: '2px dashed #9b9b9b',
        borderRadius: '3px',
        cursor: 'pointer',
        padding: 8
    },
    dropZoneContent: {
        height: '100%',
        width: '100%'
    },
    dropZoneText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#666666',
    },
    dropZoneImage: {
       width: 'auto',
       height: 'auto',
       maxHeight: 180,
       maxWidth: '100%',
       margin: '0 auto',
       display: 'block'
    },
    dropZoneTextSmall: {
        marginTop: 20,
        fontSize: 12,
        textAlign: 'center',
        color: '#666666',
    },
}

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import * as imagesActions from '../redux/actions/imagesActions';
import { compose } from '../utils/compose'

const Checkmark = ({ selected }) => (
    <div style={selected ? { left: '4px', top: '4px', position: 'absolute', zIndex: '1' } : { display: 'none' }}>
        <svg style={{ fill: 'white', position: 'absolute' }} width="24px" height="24px">
            <circle cx="12.5" cy="12.2" r="8.292"></circle>
        </svg>
        <svg style={{ fill: 'rgb(66,133,244)', position: 'absolute' }} width="24px" height="24px">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
        </svg>
    </div>
);

const imgStyle = {
    display: 'block',
    transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s'
};
const selectedImgStyle = {
    transform: 'translateZ(0px) scale3d(0.9, 0.9, 1)',
    transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s',
};
const cont = {
    backgroundColor: '#eee',
    cursor: 'pointer',
    overflow: 'hidden',
    float: 'left',
    position: 'relative'
}

class SelectedImage extends Component {
    onFinishLoading (e) {
        this.props.imageLoaded({photo: this.props.photo, width: e.target.naturalWidth, height: e.target.naturalHeight});
    }
    
    render () {
        const sx = (100 - ((30 / this.props.photo.width) * 100)) / 100;
        const sy = (100 - ((30 / this.props.photo.height) * 100)) / 100;
        selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`;
        return (
            <div style={{ margin: this.props.margin, width: this.props.photo.width, ...cont }} className={!this.props.photo.selected ? 'not-selected' : ''}>

                <Checkmark selected={this.props.photo.selected ? true : false} />
                <img onLoad={e => this.onFinishLoading(e)} alt={this.props.photo.src} style={this.props.photo.selected ? { ...imgStyle, ...selectedImgStyle } : { ...imgStyle }} {...this.props.photo} onClick={(e) => this.props.onClick(e, { index: this.props.index, photo: this.props.photo })} />

                <style>
                    {`.not-selected:hover{outline:2px solid rgb(66,133,244)}`}
                </style>
            </div>
        );
    }
};

SelectedImage.propTypes = {
    index: PropTypes.number,
    onClick: PropTypes.func,
    photo: PropTypes.shape({
        selected: PropTypes.bool,
        width: PropTypes.number,
        height: PropTypes.number,
        src: PropTypes.string
    }),
    margin: PropTypes.number
}
function mapDispatchToProps(dispatch) {
    const {
        imageLoaded
  } = imagesActions;
    return {
        imageLoaded: compose(dispatch, imageLoaded),
    }
}
export default connect(null, mapDispatchToProps)(SelectedImage);
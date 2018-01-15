import React from 'react';
import PropTypes from 'prop-types';

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
    transition: 'transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s'
};
const cont = {
    backgroundColor: '#eee',
    cursor: 'pointer',
    overflow: 'hidden',
    float: 'left',
    position: 'relative'
}

const SelectedImage = ({ index, onClick, photo, margin }) => {
    //calculate x,y scale
    const sx = (100 - ((30 / photo.width) * 100)) / 100;
    const sy = (100 - ((30 / photo.height) * 100)) / 100;
    selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`;
    return (
        <div style={{ margin, width: photo.width, ...cont }} className={!photo.selected ? 'not-selected' : ''}>

            <Checkmark selected={photo.selected ? true : false} />
            <img alt={photo.src} style={photo.selected ? { ...imgStyle, ...selectedImgStyle } : { ...imgStyle }} {...photo} onClick={(e) => onClick(e, { index, photo })} />

            <style>
                {`.not-selected:hover{outline:2px solid rgb(66,133,244)}`}
            </style>
        </div>
    )
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

export default SelectedImage;
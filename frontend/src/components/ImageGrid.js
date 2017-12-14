import React, { Component } from 'react';
import { GridList, GridListTile } from 'material-ui/GridList';
import PropTypes from 'prop-types';


export default class ImageGrid extends Component {

    render() {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        return (
            <GridList cols={5}>
                {this.props.imageData.map(tile => (
                    <GridListTile>
                        <img src={`https://dummyimage.com/${getRandomInt(100, 600)}x${getRandomInt(100, 400)}/${getRandomInt(0, 100)}/ffa`} />
                    </GridListTile>
                ))}
            </GridList>
        );
    }

}
ImageGrid.propTypes={
    imageData: PropTypes.array.isRequired
}
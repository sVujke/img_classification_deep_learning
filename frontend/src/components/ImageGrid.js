import React, { Component } from 'react';
import { GridList, GridListTile } from 'material-ui/GridList';
import { Grid } from 'material-ui';

import PropTypes from 'prop-types';
import withSizes from 'react-sizes';

const COLUMN_WIDTH = 180;


class ImageGrid extends Component {

    render() {
        return (
            <GridList cols={this.props.calculatedColumnNum}>
                {this.props.imageData.map(tile => (
                    <GridListTile key={tile}>
                        <div>
                            <img src={require(`../mlimages/${tile}`)} 
                            style={imageGridDefaultStyles.imageStyle} />
                        </div>
                    </GridListTile>
                ))}
            </GridList>
        );
        /*return (
            <Grid container direction='row' justify='flex-start' alignItems='center'>
                {this.props.imageData.map(tile => (
                    <Grid item key={tile} xs={3}>
                            <img src={require(`../mlimages/${tile}`)}
                                style={imageGridDefaultStyles.imageStyle} />
                    </Grid>
                ))}
            </Grid>
        );*/
    }
}

const imageGridDefaultStyles = {
    imageStyle: {
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'absolute',
        margin: 'auto',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
}

ImageGrid.propTypes={
    imageData: PropTypes.array.isRequired
}


const mapSizesToProps = ({ width }) => ({
    calculatedColumnNum: Math.floor(width / COLUMN_WIDTH),
});
export default withSizes(mapSizesToProps)(ImageGrid);
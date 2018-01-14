import React, { Component } from 'react';
import { GridList, GridListTile } from 'material-ui/GridList';
import SelectionAwareImage from './SelectionAwareImage';
import PropTypes from 'prop-types';
import withSizes from 'react-sizes';

const CELL_SIZE = 180;


class ImageGrid extends Component {

    checkSelection (tile) {
        var i = this.props.selectedImagesSrcs.indexOf(tile);
        var selected = false;
        if (i !== -1) selected = true;
        return selected;
    }

    render() {
        return (
            <div style={this.props.style || {}}>
                <GridList cols={this.props.calculatedColumnNum} cellHeight={CELL_SIZE}>
                    {this.props.imagesSrcs.map(tile => (
                        <GridListTile 
                            key={tile} 
                            onClick={this.props.onClickElement ? () => {this.props.onClickElement(tile); this.forceUpdate()} : () => {}}>
                                <div>
                                    <SelectionAwareImage 
                                        imageSrc={require(`../mlimages/${tile}`)} 
                                        style={imageGridDefaultStyles.imageStyle} 
                                        alt={tile}
                                        selected={this.checkSelection(tile)}
                                    />
                                </div>
                        </GridListTile>
                    ))}
                </GridList>
            </div>
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
    },

}

ImageGrid.propTypes={
    imagesSrcs: PropTypes.array.isRequired,
    selectedImagesSrcs: PropTypes.array.isRequired,
    style: PropTypes.object,
    onClickElement: PropTypes.func,

}


const mapSizesToProps = ({ width }) => ({
    calculatedColumnNum: Math.ceil(width / CELL_SIZE),
});
export default withSizes(mapSizesToProps)(ImageGrid);
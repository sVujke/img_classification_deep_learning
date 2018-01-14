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
                        style={{padding: 2}}
                            key={tile} 
                            onClick={this.props.onClickElement ? () => {this.props.onClickElement(tile); this.forceUpdate()} : () => {}}>
                                <SelectionAwareImage 
                                    imageSrc={tile} 
                                    alt={tile}
                                    selected={this.checkSelection(tile)}
                                />
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
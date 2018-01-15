import { imgSize as sizeOfImage } from "./imgSize";

export const wrapImages = (imgArray) => {
    var retval = []
    for (var i = 0; i < imgArray.length; i++) {
        let src = imgArray[i];
        let imgSize = sizeOfImage(src);
        let obj = {
            src,
            width: 1,//imgSize.width, 
            height: 1,//imgSize.height,
            selected: false
        }
        retval.push(obj);
    }
    return retval;
};

export const unwrapImages = (objArray) => {
    var selectedImages = [];
    var nonSelectedImages = [];
    for (var i = 0; i < objArray.length; i++) {
        let obj = objArray[i];
        obj.selected ? selectedImages.push(obj.src) : nonSelectedImages.push(obj.src)
    }
    return {
        selectedImages,
        nonSelectedImages
    }
}

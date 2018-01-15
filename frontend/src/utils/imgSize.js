export const imgSize = (src) => {
    var img = new Image();
    img.onload = function () {
        return {
            width: this.width,
            height: this.height
        };
    }
    img.src = 'http://www.google.com/intl/en_ALL/images/logo.gif';
}
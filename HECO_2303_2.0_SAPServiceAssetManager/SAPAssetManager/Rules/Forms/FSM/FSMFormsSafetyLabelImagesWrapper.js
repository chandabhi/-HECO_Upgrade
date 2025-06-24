import m from './FSMFormsSafetyLabelImagesM';
import p from './FSMFormsSafetyLabelImagesP';
import w from './FSMFormsSafetyLabelImagesW';

//Return the image data string for the required png.  Broken up into 3 files to keep file sizes down
export default function FSMSmartFormsSafetyLabelImagesWrapper(imageName) {
    if (imageName) {
        let image = imageName.substr(0,1);
        switch (image) {
            case 'M':
                return m(imageName);
            case 'P':
                return p(imageName);
            case 'W':
                return w(imageName);
            default:
                return '';
        }
    }
    return '';
}

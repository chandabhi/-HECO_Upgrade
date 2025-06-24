import isImageFormat from './DocumentEditorIsImageFormat';
import getFileInfo from './DocumentEditorGetFileInfo';

export default function DocumentEditorIsImageFormatWrapper(context) {
    const fileName = context.binding.Document.FileName;
    if (fileName.slice(0,4) === 'Sig_') {
        return false;
    }
    const fileInfo = getFileInfo(context);
    if (fileInfo) {
        return isImageFormat(fileInfo.FileName);
    }
    return false;
}

import getFileInfo from './DocumentEditorGetFileInfo';

export default function DocumentEditorVisible(context) {
    const fileInfo = getFileInfo(context);
    return fileInfo && !(fileInfo.FileName.slice(0,4) === 'Sig_');
}

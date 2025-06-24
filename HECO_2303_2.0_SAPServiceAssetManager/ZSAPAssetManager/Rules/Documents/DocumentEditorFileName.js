
import getFileInfo from './DocumentEditorGetFileInfo';

export default function DocumentEditorFileName(context) {
    const fileInfo = getFileInfo(context);
    if (fileInfo) {
        return fileInfo.FileName;
    }
    return context.binding.Document.FileName;
}

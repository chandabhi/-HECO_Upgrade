import libCom from '../Common/Library/CommonLibrary';
import getFileInfo from './DocumentEditorGetFileInfo';
import saveImage from './DocumentEditorOnSave';
import isAndroid from '../Common/IsAndroid';

export default function DocumentEditorSaveImage(context) {
    return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorSaveImage.action').then((result) => {
        if (result.data === true) {
            const newImg = libCom.getStateVariable(context, 'DocumentEditorEstimatedImageSource');
            if (newImg) {
                const fileInfo = getFileInfo(context);
                if (fileInfo) {
                    const fileExt = fileInfo.FileName.split('.').pop().toLowerCase();
                    if (newImg.saveToFile(fileInfo.Directory + fileInfo.FileName, fileExt)) {
                        const tempFile = context.nativescript.fileSystemModule.File.fromPath(
                                fileInfo.Directory + fileInfo.FileName + '.tmp',
                        );
                        if (tempFile) {
                            tempFile.remove();
                        }
                        libCom.setStateVariable(context, 'DocumentEditorSaveType', fileInfo.IsDeleteAllowed ? 'Recreate' : 'Overwrite');
                        context.showActivityIndicator();
                        if (isAndroid(context)) {
                            return context.executeAction('/SAPAssetManager/Actions/Page/PreviousPage.action').then(() => {
                                return saveImage(context);
                            });
                        }
                        return saveImage(context);
                    }
                }
            }
        }
        return Promise.resolve(true);
    });
}

import Logger from '../Log/Logger';
import isAndroid from '../Common/IsAndroid';
import getFileInfo from './DocumentEditorGetFileInfo';
import libBase64 from '../Common/Library/Base64Library';

export default function DocumentEditorMedia(context) {
    const fileInfo = getFileInfo(context);
    const filePath = context.nativescript.fileSystemModule.File.fromPath(fileInfo.Directory + fileInfo.FileName);

    return filePath.read().then((result) => {
        return {
            'content': isAndroid(context) ? libBase64.transformBinaryToBase64(true, result) : result,
            'contentType': context.binding.Document.MimeType,
        };
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(),'Error getting binary source: ' + error);
    });
}


import NativeScriptObject from '../Common/Library/NativeScriptObject';

export default function DocumentEditorSaveAttachment(context, attachment, fileName) {
    let tempFolder = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.knownFolders.temp();
    var documentPath = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.path.join(tempFolder.path, fileName);
    var documentFileObject = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.File.fromPath(documentPath);
    
    documentFileObject.writeSync(attachment.content, () => {
        context.getClientData().Error=context.localizeText('create_document_failed');
        context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
    });

    return tempFolder.path + '/';
}

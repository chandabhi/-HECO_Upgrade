
import libCom from '../Common/Library/CommonLibrary';
import setFileInfo from './DocumentEditorSetFileInfo';
import attachmentFileName from './DocumentEditorAttachmentFileName';
import saveAttachment from './DocumentEditorSaveAttachment';
import isImageFormat from './DocumentEditorIsImageFormat';

export default function DocumentEditorAttachmentOnValueChange(context) {
    const attachmentCount = context.getValue().length;

    if (!context.getClientData().attachmentCount) {
        context.getClientData().attachmentCount = 0;
    }

    if (attachmentCount > context.getClientData().attachmentCount) {
        const attachment = context.getValue()[attachmentCount - 1];
        const fileName = attachmentFileName(attachment);
        if (isImageFormat(fileName)) {
            return context.getPageProxy().executeAction({'Name' : '/SAPAssetManager/Actions/Common/GenericWarningDialog.action', 'Properties': {
                'Title': context.localizeText('confirm'),
                'Message': context.localizeText('attachment_picker_edit_image_message'),
                'OKCaption': context.localizeText('edit'),
                'CancelCaption': context.localizeText('attachment_picker_edit_image_cancel_caption'),
            }}).then(result => {
                context.getClientData().attachmentCount = attachmentCount;
                if (result.data === true) {
                    const directory = saveAttachment(context, attachment, fileName);
                    libCom.setStateVariable(context, 'DocumentEditorNavType', 'Attachment');
                    setFileInfo(context, {
                        FileName: fileName, Directory: directory, IsDeleteAllowed: false,
                    });
                    // workaround for iOS extension
                    context.getPageProxy().setActionBinding({
                        'Document': {
                            'FileName': fileName,
                        },
                    });
                    return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorNav.action');
                }
                return Promise.resolve();
            });
        }
    }

    context.getClientData().attachmentCount = attachmentCount;
    return Promise.resolve();
}

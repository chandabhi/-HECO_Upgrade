import getFileInfo from './DocumentEditorGetFileInfo';

export default function DocumentEditorOnDelete(context) {
    return context.getPageProxy().executeAction({'Name' : '/SAPAssetManager/Actions/Common/GenericWarningDialog.action', 'Properties': {
        'Title': context.localizeText('confirm'),
        'Message': context.localizeText('confirm_delete'),
        'OKCaption': context.localizeText('ok'),
        'CancelCaption': context.localizeText('cancel'),
    }}).then(result => {
        if (result.data === true) {
            const fileInfo = getFileInfo(context);
            if (fileInfo) {
                const tempFile = context.nativescript.fileSystemModule.File.fromPath(fileInfo.Directory + fileInfo.FileName);
                if (tempFile) {
                    tempFile.remove();
                }
            }
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                let binding = context.getPageProxy().getBindingObject();
                return context.getPageProxy().executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action', 'Properties': {
                    'Target': {
                        'EntitySet' : 'Documents',
                        'ReadLink' : binding.Document['@odata.readLink'],
                    },
                }}).then(() => {
                    return context.getPageProxy().executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action', 'Properties': {
                        'Target': {
                            'EntitySet' : binding['@odata.type'].split('.').pop() + 's',
                            'ReadLink' : binding['@odata.readLink'],
                        },
                    }});
                });
            });
        }
        return Promise.resolve();
    });
}

import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import libForms from './FSMSmartFormsLibrary';
/**
* Download any existing attachments on the attachment Picker
* @param {context} context
*/
export default function FSMFormAttachmentPickerDownloadAttachments(context) {
    //disable button visibility for all buttons
    let pageControls = context.getPageProxy().getControls()[0]._control.controls;
    for (let i = 0; i < pageControls.length; i++) {
        if (pageControls[i].type === 'Control.Type.FormCell.Button') {
            pageControls[i].controlProxy.setVisible(false);
        }
    }
    let attachmentPickerName = context.getName().substring(0, context.getName().search('DownloadButton'));
    libCom.setStateVariable(context, 'DownloadedAttachmentPicker', attachmentPickerName);
    let attachments = libCom.getStateVariable(context, 'Attachments');
    let attachmentIDs = [];
    for (let i = 0; i < attachments.length; i++) {
        if (attachmentPickerName === attachments[i].substring(0, attachments[i].search(','))) {
            attachmentIDs.push(attachments[i].substring(attachments[i].search(',') + 1, attachments[i].length));
        }
    }
    let promiseArray = [];
    //attachmentIDs contains the id's of any attachments that may or may not exist. Here we grab the array of ids
    //iterate through array to grab attachment id values
    for (let x = 0; x < attachmentIDs.length; x++) {
        if (!ValidationLibrary.evalIsEmpty(attachmentIDs[x])) {
            //get rid of hypens in the FSMFormAttachment ID
            const id = attachmentIDs[x].replace(/[^A-Za-z0-9]+/g, '');
            const readLink = "FSMFormAttachments(\'" + id + "\')";
            if (!libForms.ifMediaExist(attachmentIDs[x])) {
            //download both the offline odata as well as the media for the FSMFormAttachment
                promiseArray.push(context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Inventory/Fetch/FetchDocumentsProgressBanner.action',
                    'Properties': {
                        'Message': '$(L,forms_download_progress)',
                        'OnSuccess': {
                            'Name': '/SAPAssetManager/Actions/Documents/DownloadDocumentStreams.action',
                            'Properties': {
                                'DefiningRequests': [
                                    {
                                        'Name': readLink,
                                        'Query': readLink,
                                        'AutomaticallyRetrievesStreams': true,
                                    },
                                ],
                                'OnSuccess': {
                                    'Name': '/SAPAssetManager/Actions/Documents/DownloadMedia.action',
                                    'Properties': {
                                        'Target': {
                                            'EntitySet': 'FSMFormAttachments',
                                            'ReadLink': readLink,
                                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                                        },
                                        'OnFailure': '/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action',
                                        'OnSuccess': '/SAPAssetManager/Rules/Forms/FSM/AttachmentMediaSuccess.js',
                                        'ActionResult': {
                                            '_Name': 'FSMFormAttachmentResult',
                                        },
                                    },
                                },
                                'OnFailure': '/SAPAssetManager/Actions/Documents/DownloadDocumentStreamsFailure.action',
                            },
                        },
                    },
                }));
            }
        }
    }
    return Promise.all(promiseArray).catch(() => {
        //re-enable visibility because download failed
        pageControls = context.getPageProxy().getControls()[0]._control.controls;
        for (let i = 0; i < pageControls.length; i++) {
            if (pageControls[i].type === 'Control.Type.FormCell.Attachment' && pageControls[i].getValue().length >= 1) {
                let id = pageControls[i].getValue();
                //saved downloaded images have ContentType
                if (ValidationLibrary.evalIsEmpty(id[0].contentType)) {
                    pageControls[i + 1].controlProxy.setVisible(true);
                } else {
                    pageControls[i + 1].controlProxy.setVisible(false);
                }
            }
        }
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/SyncErrorBannerMessage.action',
            'Properties': {
                'Message': '$(L,forms_attachment_fail)',
            },
        });
    });
}

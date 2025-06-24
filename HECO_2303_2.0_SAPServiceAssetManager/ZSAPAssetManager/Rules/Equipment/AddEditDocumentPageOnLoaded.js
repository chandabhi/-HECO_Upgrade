import libCom from '../Common/Library/CommonLibrary';
import SetUpAttachmentTypes from '../Documents/SetUpAttachmentTypes';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function AddEditDocumentPageOnLoaded(context) {
    SetUpAttachmentTypes(context);

    let attachmentData = libCom.getStateVariable(context, 'InspectionCharacteristicsAttachments');
    let attachmentCtrl = context.getControl('FormCellContainer').getControl('Attachment');

    if (attachmentCtrl && attachmentData) {
        attachmentCtrl.setValue(attachmentData, true);
    }

    libCom.saveInitialValues(context);
}

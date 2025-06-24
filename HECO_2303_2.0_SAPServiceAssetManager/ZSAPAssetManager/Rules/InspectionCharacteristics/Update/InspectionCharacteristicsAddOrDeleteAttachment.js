import libCom from '../../Common/Library/CommonLibrary';

export default function InspectionCharacteristicsAddOrDeleteAttachment(context) {
    const attachmentFormcell = context.getControl('FormCellContainer').getControl('Attachment');
    libCom.setStateVariable(context, 'UpdatedInspectionCharacteristicsAttachments', attachmentFormcell.getValue());
    libCom.setStateVariable(context, 'TransactionType', 'UPDATE');
    return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
}

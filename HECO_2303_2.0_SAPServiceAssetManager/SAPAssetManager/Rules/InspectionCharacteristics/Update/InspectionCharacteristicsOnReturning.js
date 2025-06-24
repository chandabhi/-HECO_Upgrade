import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function InspectionCharacteristicsOnReturning(context) {
    let attachmentData = CommonLibrary.getStateVariable(context, 'UpdatedInspectionCharacteristicsAttachments');
    let attachmentCtrl = context.getControl('FormCellContainer').getControl('Attachment');

    if (attachmentCtrl && attachmentData) {
        CommonLibrary.setStateVariable(context, 'UpdatedInspectionCharacteristicsAttachments', undefined);
        attachmentCtrl.setValue(attachmentData, true);
    }
}

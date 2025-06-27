import libCommon from '../../Common/Library/CommonLibrary';
import isAndroid from '../../../../SAPAssetManager/Rules/Common/IsAndroid';

export default function WorkOrderListViewIconImages(context) {
    let binding = context.getBindingObject();
    var iconImage = [];

    // check if this WO has any docs
    let docs = binding.WODocuments;
    if (docs && docs.length > 0) {
        //check to see if at least one of the documents has an associated document.
        let documentExists = docs.some(doc => doc.Document !== null);
        if (documentExists) {
            if (isAndroid(context)) {
                iconImage.push('/SAPAssetManager/Images/attachmentStepIcon.android.png');
            } else {
                iconImage.push('/SAPAssetManager/Images/attachmentStepIcon.png');
            }
        }
    }

    //HECO Check for CIS notes
    //Disabled since all orders will have these notes
    // if( binding.ZWorkLocationNotes != "" || 
    //     binding.ZWorkMRInstructionNotes != "" ||
    //     binding.ZWorkSpecialInstructionNotes != "" ||
    //     binding.ZWorkCustomerAlertNotes != "") {
    //         iconImage.push('sap-icon://bell');
    //     }
    //HECO End

    // check if this order requires sync
    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal') || libCommon.getTargetPathValue(context, '#Property:OrderMobileStatus_Nav/#Property:@sap.isLocal') || libCommon.getTargetPathValue(context, '#Property:HeaderLongText/#Property:0/#Property:@sap.isLocal')) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    return iconImage;
}

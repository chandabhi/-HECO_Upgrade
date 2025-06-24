import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsAndroid from '../../Common/IsAndroid';

export default function ServiceOrderListViewIconImages(context) {
    let binding = context.getBindingObject();
    var iconImage = [];

    // check if this item has any docs
    let docs = binding.Document;
    if (docs && docs.length > 0) {
        //check to see if at least one of the documents has an associated document.
        let documentExists = docs.some(doc => doc.Document !== null);
        if (documentExists) {
            if (IsAndroid(context)) {
                iconImage.push('/SAPAssetManager/Images/attachmentStepIcon.android.png');
            } else {
                iconImage.push('/SAPAssetManager/Images/attachmentStepIcon.png');
            }
        }
    }

    // check if this order requires sync
    if (CommonLibrary.getTargetPathValue(context, '#Property:@sap.isLocal') || CommonLibrary.getTargetPathValue(context, '#Property:MobileStatus_Nav/#Property:@sap.isLocal')) {
        iconImage.push(IsAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    return iconImage;
}

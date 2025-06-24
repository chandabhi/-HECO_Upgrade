import isAndroid from '../Common/IsAndroid';
import libCommon from '../Common/Library/CommonLibrary';

export default function EquipmentListViewIconImages(context) {

    // check if this Equipment has any docs
    const docs = context.binding.EquipDocuments && context.binding.EquipDocuments.filter(doc => doc.Document !== null) || [];
    const iconImage = [];

    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal') && libCommon.getTargetPathValue(context, '#Property:@sap.hasPendingChanges') || docs.some(doc => doc['@sap.isLocal'])) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    if (docs.length > 0) {
        iconImage.push(isAndroid(context)? '/SAPAssetManager/Images/attachmentStepIcon.android.png' : '/SAPAssetManager/Images/attachmentStepIcon.png');
    }

    return iconImage;
}

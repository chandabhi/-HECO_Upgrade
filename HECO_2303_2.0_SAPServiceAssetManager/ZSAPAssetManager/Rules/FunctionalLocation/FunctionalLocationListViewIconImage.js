import libCommon from '../Common/Library/CommonLibrary';
import isAndroid from '../Common/IsAndroid';

export default function FunctionalLocationListViewIconImages(context) {
    // check if this FLOC has any docs
    const docs = context.binding.FuncLocDocuments && context.binding.FuncLocDocuments.filter(doc => doc.Document !== null) || [];
    const iconImage = [];

    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal') || docs.some(doc => doc['@sap.isLocal'])) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    if (docs.length > 0) {
        iconImage.push(isAndroid(context)? '/SAPAssetManager/Images/attachmentStepIcon.android.png' : '/SAPAssetManager/Images/attachmentStepIcon.png');
    }

    return iconImage;
}

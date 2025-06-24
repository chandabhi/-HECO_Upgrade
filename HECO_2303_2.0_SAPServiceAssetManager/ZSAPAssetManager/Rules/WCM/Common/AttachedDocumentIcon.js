import IsAndroid from '../../Common/IsAndroid';


export default function AttachedDocumentIcon(context, docs) {
    if (docs && docs.length > 0) {
        if (docs.some(doc => doc.Document)) {
            return IsAndroid(context) ? '/SAPAssetManager/Images/attachmentStepIcon.android.png' : '/SAPAssetManager/Images/attachmentStepIcon.png';
        }
    }
}

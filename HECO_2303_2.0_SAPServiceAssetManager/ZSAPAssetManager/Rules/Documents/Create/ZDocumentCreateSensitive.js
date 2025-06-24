
import getDocsData from './DocumentOnCreateGetStateVars';

export default function ZDocumentCreateSensitive(context) {
    //HECO
    //Add a flag to note sensitive attachment
    try {
            let sensitive = context.getPageProxy().evaluateTargetPath('#Control:ZDocumentSensitiveSwitch/#Value');
            return sensitive == true ? 'X' : ' ';
        } catch (err) {
            const { ZDocumentIsSensitive } = getDocsData(context);
            return ZDocumentIsSensitive == true ? 'X' : ' ';
        }
}
import libCom from '../../Common/Library/CommonLibrary';

export default function StatusTestTagPrintedText(context) {
    return libCom.getEntityProperty(context, `SystemStatuses('${context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/TestTagPrinted.global').getValue()}')`, 'StatusText');
}

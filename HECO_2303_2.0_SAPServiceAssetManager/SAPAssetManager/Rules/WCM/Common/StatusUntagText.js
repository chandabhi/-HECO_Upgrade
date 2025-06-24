import libCom from '../../Common/Library/CommonLibrary';

export default function StatusUntagText(context) {
    return libCom.getEntityProperty(context, `SystemStatuses('${context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Untag.global').getValue()}')`, 'StatusText');
}

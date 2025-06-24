import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function ElectricalOpGroupText(context) {
    return CommonLibrary.getEntityProperty(context, `WCMOpGroups('${context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/OperationalGroups/Electrical.global').getValue()}')`, 'TextOpGroup');
}

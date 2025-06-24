import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function MechanicalOpGroupText(context) {
    return CommonLibrary.getEntityProperty(context, `WCMOpGroups('${context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/OperationalGroups/Mechanical.global').getValue()}')`, 'TextOpGroup');
}

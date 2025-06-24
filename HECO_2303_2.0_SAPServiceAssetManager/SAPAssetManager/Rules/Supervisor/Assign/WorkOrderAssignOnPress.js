import libVal from '../../Common/Library/ValidationLibrary';

export default function WorkOrderAssignOnPress(context) {
    try {
        let clientData = context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData();
        if (!libVal.evalIsEmpty(clientData) && Object.prototype.hasOwnProperty.call(clientData,'IsUnAssign') && clientData.IsUnAssign) {
            return context.executeAction('/SAPAssetManager/Rules/Supervisor/UnAssign/WorkOrderUnAssignChangeSet.js');
        } else if (!libVal.evalIsEmpty(clientData) && Object.prototype.hasOwnProperty.call(clientData,'IsAssign') && clientData.IsAssign) {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignPageRequiredFields.action');
        } else if (!libVal.evalIsEmpty(clientData) && Object.prototype.hasOwnProperty.call(clientData,'IsReAssign') && clientData.IsReAssign) {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/ReAssign/WorkOrderReAssignPageRequiredFields.action');
        }
    } catch (error) {
        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignPageRequiredFields.action');
    }
}

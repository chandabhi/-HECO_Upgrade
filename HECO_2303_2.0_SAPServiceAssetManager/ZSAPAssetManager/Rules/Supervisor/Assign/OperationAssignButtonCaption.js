import libVal from '../../Common/Library/ValidationLibrary';

export default function OperationAssignButtonCaption(context) {
    try {
        let clientData = context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData();
        if (!libVal.evalIsEmpty(clientData) && Object.prototype.hasOwnProperty.call(clientData,'IsUnAssign') && clientData.IsUnAssign) {
            return context.localizeText('unassign');
        } else if (!libVal.evalIsEmpty(clientData) && Object.prototype.hasOwnProperty.call(clientData,'IsAssign') && clientData.IsAssign) {
            return context.localizeText('assign');
        } else if (!libVal.evalIsEmpty(clientData) && Object.prototype.hasOwnProperty.call(clientData,'IsReAssign') && clientData.IsReAssign) {
            return context.localizeText('reassign');
        }
        return context.localizeText('assign');
    } catch (error) {
        return context.localizeText('assign');
    } 
}

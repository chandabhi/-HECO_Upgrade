import libSuper from '../SupervisorLibrary';
export default function WorkOrderOperationAssignedTo(context) {
    if (!libSuper.isSupervisorFeatureEnabled(context)) { //Only display if supervisor is enabled
        return Promise.resolve('-');
    }
    let binding = context.binding;
    
    if (binding.Employee_Nav) {
        return Promise.resolve(binding.Employee_Nav.EmployeeName);
    }
    
    return Promise.resolve(context.localizeText('unassigned'));
}

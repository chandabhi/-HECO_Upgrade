export default function ZCISCustomerAlertsVisible(context) {
    //Determines if CIS Customer alerts should be shown on Work Order and Notification detail pages
    //If any note is set, alerts are available
    let binding;
    if(context.binding["@odata.type"] == "#sap_mobile.MyWorkOrderHeader") {
        binding = context.binding;
    }else if(context.binding["@odata.type"] == "#sap_mobile.MyNotificationHeader" &&
            context.binding.WorkOrder) {
        binding = context.binding.WorkOrder;
    }

    if( binding.ZWorkLocationNotes != "" || 
        binding.ZWorkMRInstructionNotes != "" ||
        binding.ZWorkSpecialInstructionNotes != "" ||
        binding.ZWorkCustomerAlertNotes != "") {
            return true;
        }

    return false;
}

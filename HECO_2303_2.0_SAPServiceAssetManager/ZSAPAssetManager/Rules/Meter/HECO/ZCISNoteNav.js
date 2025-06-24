import CommonLibrary from "../../Common/Library/CommonLibrary";

export default function ZCISNoteNav(context) {

    let notes = {
        ZWorkLocationNotes: context.binding.ZWorkLocationNotes,
        ZWorkMRInstructionNotes: context.binding.ZWorkMRInstructionNotes,
        ZWorkSpecialInstructionNotes: context.binding.ZWorkSpecialInstructionNotes,
        ZWorkCustomerAlertNotes: context.binding.ZWorkCustomerAlertNotes
    };
    
    CommonLibrary.setStateVariable(context, 'ZCISNotes', notes);

    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/ZWorkOrderCISNotesNav.action')

}

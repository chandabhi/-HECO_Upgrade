export default function TimeSheetEntryEditNav(context) {
    let binding = context.binding;
    if(context.binding.Status&&context.binding.Status=="20"){//Enable Edit button
        return true;
    }
    else if (!binding['@sap.isLocal']) {
        context.setActionBarItemVisible(0, false);
    } 
}

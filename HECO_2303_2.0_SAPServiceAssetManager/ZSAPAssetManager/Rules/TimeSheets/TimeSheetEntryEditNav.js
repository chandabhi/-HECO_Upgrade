import libCom from '../Common/Library/CommonLibrary'; 
export default function TimeSheetEntryEditNav(context) {
    let binding = context.binding;
    libCom.setOnCreateUpdateFlag(context, 'UPDATE');
    if (binding['@sap.isLocal']||(context.binding.Status&&context.binding.Status=="20")) {//Opens edit timeSheet page
        return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryEditNav.action');
    } 
}

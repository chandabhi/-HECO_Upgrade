import libCom from "../../Common/Library/CommonLibrary";

export default function ZTimeSheetCreateUpdateZWageType(context) {
    try {

        let wagePicker = libCom.getTargetPathValue(context, '#Control:ZWageTypeLstPkr/#Value');
        return libCom.getListPickerValue(wagePicker);
        
    }
    catch (error) { //Control doesn't exist for crew time entry screen
        return "";
    }
}

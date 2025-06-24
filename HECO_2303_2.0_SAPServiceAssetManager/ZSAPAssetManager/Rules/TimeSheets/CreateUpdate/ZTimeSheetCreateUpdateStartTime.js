import libCom from "../../Common/Library/CommonLibrary";
import ODataDate from "../../Common/Date/ODataDate";

export default function ZTimeSheetCreateUpdateStartTime(context) {

    let wageType = context.getPageProxy().getControl('FormCellContainer').getControl('ZWageTypeLstPkr').getValue();

    //If wage type selected, return blank for time
    if (wageType.length == 1) {
        return '';
    }
    else {
        let date = libCom.getControlProxy(context, 'StartTimePicker').getValue();
        date.setSeconds(0);
        let odataDate = new ODataDate(date);
        return odataDate.toDBTimeString(context);
    }

}

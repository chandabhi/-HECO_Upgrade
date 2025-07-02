import libCom from "../../Common/Library/CommonLibrary";
import ODataDate from "../../../../SAPAssetManager/Rules/Common/Date/ODataDate";

export default function ZTimeSheetCreateUpdateDuration(context) {
    let duration = 0;

    let wageType = context.getPageProxy().getControl('FormCellContainer').getControl('ZWageTypeLstPkr').getValue();

    //Duration for wage types is input directly
    if (wageType.length == 1) {
        duration = context.getPageProxy().getControl('FormCellContainer').getControl('DurationPkr').getValue();
    } else {
        //If no wage type is selected, duration is calculated based on date, start and end time
        let odataStart = new ODataDate(libCom.getControlProxy(context, 'StartTimePicker').getValue());
        let odataEnd = new ODataDate(libCom.getControlProxy(context, 'EndTimePicker').getValue());

        odataStart._date.setSeconds(0, 0);
        odataEnd._date.setSeconds(0, 0);
        duration = Math.abs(odataStart._date - odataEnd._date) / 36e5;
        duration = +(Math.round(duration + "e+2") + "e-2");
        if((odataStart._date - odataEnd._date) > 0) { //If start is later than end then it's overnight
            duration = 24 - duration;
        }

        
    }

    return duration;
}

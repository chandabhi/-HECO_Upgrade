import CommonLibrary from "../../Common/Library/CommonLibrary";
import ODataDate from "../../Common/Date/ODataDate";

export default function ZMeterActivityDate(context) {
    //Expected state variable format is oData stored in UTC
    let meterDetails = CommonLibrary.getStateVariable(context, 'ZDeviceDetails');
    if(meterDetails && meterDetails.DateTime) {
        let dateTime = meterDetails.DateTime._date.toISOString();
        return dateTime;
    }

}

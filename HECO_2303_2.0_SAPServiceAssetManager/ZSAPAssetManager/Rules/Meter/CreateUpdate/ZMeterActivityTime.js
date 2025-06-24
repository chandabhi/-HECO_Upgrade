import CommonLibrary from "../../Common/Library/CommonLibrary";
import ODataDate from "../../Common/Date/ODataDate";

export default function ZMeterActivityTime(context) {
    //Expected state variable format is oData stored in UTC
    //SAP is expecting a 4 character time entry with time zone shifted to DB time
    let meterDetails = CommonLibrary.getStateVariable(context, 'ZDeviceDetails');
    if(meterDetails && meterDetails.DateTime) {
        let time = meterDetails.DateTime.toDBTimeString(context).split(':');
        return time[0] + time[1];
    }
}

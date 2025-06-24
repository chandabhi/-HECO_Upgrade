import CommonLibrary from "../../Common/Library/CommonLibrary";

export default function ZMeterNotifNum(context) {
    let meterDetails = CommonLibrary.getStateVariable(context, 'ZDeviceDetails');
    return meterDetails.NotifNum;

}

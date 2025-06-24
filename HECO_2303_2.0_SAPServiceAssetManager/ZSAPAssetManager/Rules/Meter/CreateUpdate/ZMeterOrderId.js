import CommonLibrary from "../../Common/Library/CommonLibrary";

export default function ZMeterOrderId(context) {
    let meterDetails = CommonLibrary.getStateVariable(context, 'ZDeviceDetails');
    return meterDetails.OrderId;

}

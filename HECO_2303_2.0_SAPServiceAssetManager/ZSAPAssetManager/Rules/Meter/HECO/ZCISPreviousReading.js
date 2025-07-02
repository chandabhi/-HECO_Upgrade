import CommonLibrary from "../../Common/Library/CommonLibrary";
import OffsetODataDate from "../../../../SAPAssetManager/Rules/Common/Date/OffsetODataDate";

export default function ZCISPreviousReading(context) {
    //ZDeviceNum = {OrderId, NotifNum, EquipId}
    let equipment = CommonLibrary.getStateVariable(context, 'ZDeviceDetails').EquipId; 
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'  and PreviousReadingTimestamp ne null&$orderby=MeterReadingDate desc`).then(function(result) {
        if (result && result.length > 0 ) {
            let reading = result.getItem(0);
            let meterReadingTime =  new OffsetODataDate(context, reading.PreviousReadingTimestamp);
            return reading.PreviousReading + ' on ' + context.formatDatetime(meterReadingTime.date(), '', '', { 'format': 'medium' });;
        } else {
            return '';
        }
    });
}

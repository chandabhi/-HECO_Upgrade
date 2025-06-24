import CommonLibrary from "../../Common/Library/CommonLibrary";

export default function ZCISPreviousReadingStatus(context) {
    //ZDeviceNum = {OrderId, NotifNum, EquipId}
    let equipment = CommonLibrary.getStateVariable(context, 'ZDeviceDetails').EquipId; 
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}' and PreviousReadingTimestamp ne null&$orderby=MeterReadingDate desc`).then(function(result) {
        if (result && result.length > 0) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadingStatuses', [], `$filter=MeterReadingStatus eq '${result.getItem(0).PreviousReadingStatus}'`).then(function(statusResults) {
                if (statusResults && statusResults.length > 0) {
                    let meterStatus = statusResults.getItem(0);
                    return meterStatus.MeterReadingStatus + ' - ' + meterStatus.Text;
                    
                }
            });
        } else {
            return '';
        }
    });
}

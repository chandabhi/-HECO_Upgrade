import ZCISIsMeterOrder from "../../Meter/HECO/ZCISIsMeterOrder";

export default function ZWorkOrderListViewZWorkOrderListViewSubhead(context) {
    //HECO
    //CIS show additional meter and device details alongside order number
    var subhead = context.binding.OrderId;

    if (ZCISIsMeterOrder(context.binding.OrderType)) {
        if(context.binding.ZMeterReadingUnit) {
            subhead = subhead +
                ' - MRU/Seq: ' +
                context.binding.ZMeterReadingUnit +
                ' / ' +
                context.binding.ZMeterSequenceNum;
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], `$filter=EquipId eq '${context.binding.HeaderEquipment}'`).then(function (result) {
            if (result && result.length > 0) {
                return subhead + ' Device: ' + result.getItem(0).ZDeviceSpec
            } else {
                return subhead;
            }
        });
    }

    return subhead;
}

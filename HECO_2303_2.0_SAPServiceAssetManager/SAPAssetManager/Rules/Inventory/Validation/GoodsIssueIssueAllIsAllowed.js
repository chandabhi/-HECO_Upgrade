import allowIssue from '../StockTransportOrder/AllowIssueForSTO';

export default function GoodsIssueIssueAllIsAllowed(context) {
    
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let query;
    let target;

    if (type === 'ReservationHeader') {
        let resNumber = context.binding.ReservationNum;
        query = "$filter=ReservationNum eq '" + resNumber + "' and Completed ne 'X' and SupplyStorageLocation ne ''";
        query += ' and (RequirementQuantity gt WithdrawalQuantity)';
        target = 'ReservationItems';
    } else if (type === 'StockTransportOrderHeader') {
        if (allowIssue(context)) {
            let stoNumber = context.binding.StockTransportOrderId;
            query = "$filter=StockTransportOrderId eq '" + stoNumber + "' and DeliveryCompletedFlag ne 'X' and FinalDeliveryFlag ne 'X' and StorageLoc ne ''";
            query += ' and (OrderQuantity gt IssuedQuantity)';
            target = 'StockTransportOrderItems';
        } else {
            return false; //This is a receipt, not an issue
        }
    } else if (type === 'ProductionOrderHeader') {
        let orderNumber = context.binding.OrderId;
        query = "$filter=OrderId eq '" + orderNumber + "' and Completed ne 'X' and SupplyStorageLocation ne ''";
        query += ' and (RequirementQuantity gt WithdrawalQuantity)';
        target = 'ProductionOrderComponents';
    }

    query += " and MaterialPlant_Nav/BatchIndicator eq '' and MaterialPlant_Nav/SerialNumberProfile eq ''";
    query += '&$top=1';

    //To allow auto issue, at least 1 line item must have all the following true:
    //Open quantity greater than zero
    //Cannot have delivery complete flag set
    //Storage location cannot be empty 
    //Cannot be batch enabled material
    //Cannot be serialized material
    return context.read('/SAPAssetManager/Services/AssetManager.service', target, ['ItemNum'], query).then(function(results) {
        if (results && results.length > 0) {
            return true;
        }
        return false; //No items can be auto-issued
    });
}

import libCom from '../../../Common/Library/CommonLibrary';
import resetListPageVariables from '../ResetListPageVariables';

export default class {
    /**
     * Opens document details page for the Inventory Persona
     */
    static openInventoryDocDetailsPage(context, entitySet, queryOptions) {
        let query = queryOptions;
        if (!query.includes('$expand=')) {
            query += '&$expand=OutboundDelivery_Nav,ReservationHeader_Nav,PurchaseOrderHeader_Nav,StockTransportOrderHeader_Nav,InboundDelivery_Nav,PhysicalInventoryDocHeader_Nav,ProductionOrderHeader_Nav/ProductionOrderItem_Nav/Material_Nav,MaterialDocument_Nav/RelatedItem,PurchaseRequisitionHeader_Nav/PurchaseRequisitionLongText_Nav,PurchaseRequisitionHeader_Nav/PurchaseRequisitionItem_Nav/PurchaseRequisitionLongText_Nav';
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], query).then(data => {
            if (data.length === 1) {
                libCom.setStateVariable(context, 'EmptySearchOnOverview', true);
                let docInfo = data.getItem(0);
                if (docInfo.PurchaseOrderHeader_Nav) {
                    resetListPageVariables(context);
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.PurchaseOrderHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/PurchaseOrder/PurchaseOrderDetailsNav.action');
                } else if (docInfo.InboundDelivery_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.InboundDelivery_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/Inbound/InboundDeliveryDetailNav.action');
                } else if (docInfo.StockTransportOrderHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.StockTransportOrderHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/StockTransportOrder/StockTransportOrderDetailsNav.action');
                } else if (docInfo.OutboundDelivery_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.OutboundDelivery_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/OutboundDelivery/OutboundDeliveryDetailNav.action');
                } else if (docInfo.ReservationHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.ReservationHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/Reservation/ReservationDetailsNav.action');
                } else if (docInfo.PhysicalInventoryDocHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.PhysicalInventoryDocHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryDetailsNav.action');
                } else if (docInfo.ProductionOrderHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.ProductionOrderHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/ProductionOrder/ProductionOrderDetailsNav.action');
                } else if (docInfo.PurchaseRequisitionHeader_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.PurchaseRequisitionHeader_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionDetailsNav.action');
                } else if (docInfo.MaterialDocument_Nav) {
                    context.evaluateTargetPathForAPI('#Page:InventoryOverview').setActionBinding(docInfo.MaterialDocument_Nav);
                    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDetailsIMNav.action');
                }
            }
            return false;
        });
    }

    /**
     * Getting actual value of material field for IM document
     */
    static getInventoryDocumentMaterialNum(context) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        let materialNum = '-1'; // default value if we don't have Materal Num
        if (type === 'MaterialDocItem' || type === 'InboundDeliveryItem'
            || type === 'OutboundDeliveryItem' || type === 'PhysicalInventoryDocItem'
            || type === 'PurchaseRequisitionItem') {
            materialNum = context.binding.Material;
        } else {
            materialNum = context.binding.MaterialNum;
        }
        return materialNum;
    }

    /**
     * Update state of deleted documents for the IM persona view
     */
    static updateDeletedDocsState(context) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'OnDemandObjects', [], "$filter=Action eq 'D'").then(results => {
            if (results) {
                libCom.setStateVariable(context, 'IMPersonaRemovedObjectIds', results);
            } else {
                libCom.removeStateVariable(context, 'IMPersonaRemovedObjectIds');
            }
        });
    }
}

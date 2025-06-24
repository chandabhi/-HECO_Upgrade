import MaterialHeaderButtonVisible from './MaterialHeaderButtonVisible';
import SetMaterialDocumentGoodsReceipt from '../MaterialDocument/SetMaterialDocumentGoodsReceipt';
import SetPurchaseOrderGoodsReceipt from '../PurchaseOrder/SetPurchaseOrderGoodsReceipt';
import SetPhysicalInventoryCountHeaderExists from '../PhysicalInventory/SetPhysicalInventoryCountHeaderExists';
import SetGoodsReceiptOutboundDelivery from '../OutboundDelivery/SetGoodsReceiptOutboundDelivery';
import SetGoodsReceiptInboundDelivery from '../InboundDelivery/SetGoodsReceiptInboundDelivery';

export default function SetItemEdit(context) {
    const item = context.getPageProxy().getClientData().item || context.binding;
    if (MaterialHeaderButtonVisible(context, true)) {
        return SetMaterialDocumentGoodsReceipt(context);
    } else if (item['@odata.type'].includes('PhysicalInventoryDocItem') || item['@odata.type'].includes('PhysicalInventoryDocHeader')) {
        return SetPhysicalInventoryCountHeaderExists(context);
    } else if (item['@odata.type'].includes('OutboundDeliveryItem') || item['@odata.type'].includes('OutboundDelivery')) {
        return SetGoodsReceiptOutboundDelivery(context);
    } else if (item['@odata.type'].includes('InboundDeliveryItem') || item['@odata.type'].includes('InboundDelivery')) {
        return SetGoodsReceiptInboundDelivery(context);
    } else {
        return SetPurchaseOrderGoodsReceipt(context);
    }
}

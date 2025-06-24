import purchaseRequisitionDateCaption from '../PurchaseRequisition/PurchaseRequisitionDateCaption';

export default function ItemBodyText(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const item = context.getPageProxy().getClientData().item || context.binding;
    const physicType = 'PhysicalInventoryDocItem';
    const purchaseReqType = 'PurchaseRequisitionItem';

    if (type === physicType) {
        if (item.ItemCounted) {
            return context.localizeText('counted');
        } else {
            return context.localizeText('pi_uncounted');
        }
    } else if (type === purchaseReqType) {
        return purchaseRequisitionDateCaption(context, item.RequisitionDate);
    }
}

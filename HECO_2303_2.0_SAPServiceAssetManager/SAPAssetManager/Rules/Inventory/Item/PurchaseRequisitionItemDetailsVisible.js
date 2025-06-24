export default function PurchaseRequisitionItemDetailsVisible(context) {
    const type = context.getPageProxy().binding['@odata.type'].substring('#sap_mobile.'.length);
    const purchaseReqType = 'PurchaseRequisitionItem';

    return type === purchaseReqType;
}

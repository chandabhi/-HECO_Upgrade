import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/IssueOrReceiptCreateUpdateNavWrapper';
import receipt from '../StockTransportOrder/SetSTOGoodsReceipt';
import issue from '../StockTransportOrder/SetSTOIssue';
import allowIssue from '../StockTransportOrder/AllowIssueForSTO';
import EditPurchaseRequisitionNav from '../PurchaseRequisition/EditPurchaseRequisitionNav';
import PurchaseRequisitionLibrary from '../PurchaseRequisition/PurchaseRequisitionLibrary';

export default function SetPurchaseOrderGoodsReceipt(context) {
    let binding = context.binding || context.getPageProxy().getActionBinding();
    let type = binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'StockTransportOrderItem' || type === 'StockTransportOrderHeader') {
        if (allowIssue(context)) {
            return issue(context); //Supplying plant matches user's default plant, so do an issue
        }
        return receipt(context);
    } else if (type === 'PurchaseOrderItem' || type === 'PurchaseOrderHeader') {
        libCom.setStateVariable(context, 'IMObjectType', 'PO'); //PO/STO/RES/IN/OUT/ADHOC/PRD
        libCom.setStateVariable(context, 'IMMovementType', 'R'); //I/R
        return wrapper(context);    
    } else if (type === 'ReservationItem' || type === 'ReservationHeader') {
        libCom.setStateVariable(context, 'IMObjectType', 'RES');
        libCom.setStateVariable(context, 'IMMovementType', 'I');
        return wrapper(context);
    } else if (
        (type === 'ProductionOrderHeader' && context.currentPage.id === 'ProductionOrderComponentsListPage') ||
        type === 'ProductionOrderComponent'
    ) {
        libCom.setStateVariable(context, 'IMObjectType', 'PRD');
        libCom.setStateVariable(context, 'IMMovementType', 'I');
        return wrapper(context);
    } else if (
        (type === 'ProductionOrderHeader' && context.currentPage.id === 'PurchaseOrderItemsListPage') ||
        type === 'ProductionOrderItem'
    ) {
        libCom.setStateVariable(context, 'IMObjectType', 'PRD');
        libCom.setStateVariable(context, 'IMMovementType', 'R');
        return wrapper(context);
    } else if (type === 'PurchaseRequisitionHeader' || type === 'PurchaseRequisitionItem') {
        const isLocal = libCom.isCurrentReadLinkLocal(binding['@odata.readLink']);
        if (isLocal) {
            PurchaseRequisitionLibrary.setDetailsPageFlag(context, true);
            return EditPurchaseRequisitionNav(context);
        }
        return false;
    }
}

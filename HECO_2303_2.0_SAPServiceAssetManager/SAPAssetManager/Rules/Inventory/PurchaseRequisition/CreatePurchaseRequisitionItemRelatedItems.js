import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function CreatePurchaseRequisitionItemRelatedItems(context) {
    let actions = [];
    let controls = CommonLibrary.getControlDictionaryFromPage(context);

    if (controls) {
        let itemNote = CommonLibrary.getControlValue(controls.ItemNote);
        if (!ValidationLibrary.evalIsEmpty(itemNote)) {
            let actionName = '/SAPAssetManager/Actions/Inventory/PurchaseRequisition/CreateItemNote.action';
            if (context.binding && context.binding.PurchaseRequisitionLongText_Nav && context.binding.PurchaseReqItemNo) {
                let prevItemNote = context.binding.PurchaseRequisitionLongText_Nav.find(note => note.PurchaseReqItemNo === context.binding.PurchaseReqItemNo);
                if (prevItemNote) {
                    context.binding.ItemNoteLink = prevItemNote['@odata.readLink'];
                    actionName = '/SAPAssetManager/Actions/Inventory/PurchaseRequisition/UpdateItemNote.action';
                }
            }
            actions.push(context.executeAction(actionName));
        }

        let headerNote = CommonLibrary.getControlValue(controls.HeaderNote);
        if (!ValidationLibrary.evalIsEmpty(headerNote)) {
            let actionName = '/SAPAssetManager/Actions/Inventory/PurchaseRequisition/CreateHeaderNote.action';
            if (context.binding) {
                let purchaseReqNo = context.binding.PurchaseReqNo;
            
                return context.read('/SAPAssetManager/Services/AssetManager.service', `PurchaseRequisitionHeaders('${purchaseReqNo}')`, [], '$expand=PurchaseRequisitionLongText_Nav').then(result => {
                    if (result.length) {
                        let header = result.getItem(0);
                        let prevHeaderNote = header.PurchaseRequisitionLongText_Nav.find(note => !note.PurchaseReqItemNo || note.PurchaseReqItemNo === '00000');
                        if (prevHeaderNote) {
                            context.binding.HeaderNoteLink = prevHeaderNote['@odata.readLink'];
                            actionName = '/SAPAssetManager/Actions/Inventory/PurchaseRequisition/UpdateHeaderNote.action';
                        }
                    }
            
                    actions.push(context.executeAction(actionName));
                    return Promise.all(actions);
                });
            } else {
                actions.push(context.executeAction(actionName));
            }
        }
    }

    return Promise.all(actions);
}

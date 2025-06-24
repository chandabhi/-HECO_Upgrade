import libMobile from '../MobileStatus/MobileStatusLibrary';
import NavOnCompleteWorkOrderPage from '../WorkOrders/NavOnCompleteWorkOrderPage';
import NavOnCompleteOperationPage from '../WorkOrders/Operations/NavOnCompleteOperationPage';

/**
* Display warning dialog and open complete modal page after supervisor approved business object
* @param {IClientAPI} context
*/
export default function ApprovalPostUpdate(context) {
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusSuccessMessage.action').then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Supervisor/AutoCompleteWarningDialog.action').then(() => {
            if (libMobile.isHeaderStatusChangeable(context)) {
                return NavOnCompleteWorkOrderPage(context);
            } else {
                return NavOnCompleteOperationPage(context);
            }
        });
    });
}

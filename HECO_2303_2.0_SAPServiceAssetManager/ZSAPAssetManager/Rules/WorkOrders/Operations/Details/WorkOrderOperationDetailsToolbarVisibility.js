import pageToolbar from '../../../../../SAPAssetManager/Rules/Common/DetailsPageToolbar/DetailsPageToolbarClass';
import common from '../../../Common/Library/CommonLibrary';
import OperationEnableMobileStatus from '../../../../../SAPAssetManager/Rules/Operations/MobileStatus/OperationEnableMobileStatus';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function WorkOrderOperationDetailsToolbarVisibility(context) {
    if(context.binding.WOHeader&&context.binding.WOHeader.OrderType&&context.binding.WOHeader.OrderType==="TC01"){
        return false;
    }
    return OperationEnableMobileStatus(context).then(visible => {
        return visible && common.isDefined(pageToolbar.getInstance().getToolbarItems(context));
    });
}

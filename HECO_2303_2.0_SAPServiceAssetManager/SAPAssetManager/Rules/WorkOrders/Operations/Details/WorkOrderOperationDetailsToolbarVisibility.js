import pageToolbar from '../../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import common from '../../../Common/Library/CommonLibrary';
import OperationEnableMobileStatus from '../../../Operations/MobileStatus/OperationEnableMobileStatus';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function WorkOrderOperationDetailsToolbarVisibility(context) {
    return OperationEnableMobileStatus(context).then(visible => {
        return visible && common.isDefined(pageToolbar.getInstance().getToolbarItems(context));
    });
}

import pageToolbar from '../../../../SAPAssetManager/Rules/Common/DetailsPageToolbar/DetailsPageToolbarClass';
import common from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import WorkOrderEnableMobileStatus from '../../../../SAPAssetManager/Rules/WorkOrders/MobileStatus/WorkOrderEnableMobileStatus';

export default function WorkOrderDetailsToolbarVisibility(context) {
    if(context.binding.OrderType==="TC01"){
        return WorkOrderEnableMobileStatus(context).then(visible => {
            visible = true;
            return visible && common.isDefined(pageToolbar.getInstance().getToolbarItems(context));
        });
    }
    return false;
}


import pageToolbar from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import common from '../../Common/Library/CommonLibrary';
import WorkOrderEnableMobileStatus from '../MobileStatus/WorkOrderEnableMobileStatus';

export default function WorkOrderDetailsToolbarVisibility(context) {
    if(context.binding.OrderType==="TC01"){
        return WorkOrderEnableMobileStatus(context).then(visible => {
            visible = true;
            return visible && common.isDefined(pageToolbar.getInstance().getToolbarItems(context));
        });
    }
    return false;
}


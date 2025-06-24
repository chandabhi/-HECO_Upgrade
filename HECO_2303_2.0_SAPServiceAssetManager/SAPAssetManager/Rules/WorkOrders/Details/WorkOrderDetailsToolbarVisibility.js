import pageToolbar from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import common from '../../Common/Library/CommonLibrary';
import WorkOrderEnableMobileStatus from '../MobileStatus/WorkOrderEnableMobileStatus';

export default function WorkOrderDetailsToolbarVisibility(context) {
    return WorkOrderEnableMobileStatus(context).then(visible => {
        return visible && common.isDefined(pageToolbar.getInstance().getToolbarItems(context));
    });
}

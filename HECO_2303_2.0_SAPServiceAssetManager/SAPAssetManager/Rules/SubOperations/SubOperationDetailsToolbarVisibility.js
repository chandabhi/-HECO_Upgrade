import common from '../Common/Library/CommonLibrary';
import SubOperationEnableMobileStatus from './MobileStatus/SubOperationEnableMobileStatus';
import pageToolbar from '../Common/DetailsPageToolbar/DetailsPageToolbarClass';

/**
* Enable/disable page toolbar depending on SubOperationEnableMobileStatus rule and possible mobile status options
*/
export default function SubOperationDetailsToolbarVisibility(context) {
    return SubOperationEnableMobileStatus(context).then(visible => {
        return visible && common.isDefined(pageToolbar.getInstance().getToolbarItems(context));
    });
}

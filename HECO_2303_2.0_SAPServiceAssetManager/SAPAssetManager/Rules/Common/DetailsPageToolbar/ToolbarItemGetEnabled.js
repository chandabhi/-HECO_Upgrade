import ToolbarGetStatusOptions from './ToolbarGetStatusOptions';
import pageToolbar from './DetailsPageToolbarClass';
import common from '../Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default function ToolbarItemGetEnabled(context) {
    // we can't change mobile status of WO if we are not on header level assignment, so avoid doing these steps
    const pageName = common.getPageName(context);
    if ((pageName === 'WorkOrderDetailsPage' || pageName === 'ServiceOrderDetailsPage') && !libMobile.isHeaderStatusChangeable(context)) {
        return '';
    }

    const buttonName = context.getName();
    const toolbar = pageToolbar.getInstance();
    const possibleActions = toolbar.getToolbarItems(context);

    if (!common.isDefined(possibleActions)) {
        let getStatusOptionsPromise = ToolbarGetStatusOptions(context);
        return getStatusOptionsPromise.then(items => {
            return toolbar.generatePossibleToolbarItems(context, items).then(() => {
                return toolbar.getToolbarItemIsEnabled(context, buttonName);
            });
        });
    } else {
        return toolbar.getToolbarItemIsEnabled(context, buttonName);
    }
}

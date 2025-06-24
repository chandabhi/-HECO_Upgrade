import libCommon from '../Common/Library/CommonLibrary';
import {WorkOrderLibrary as libWo} from './WorkOrderLibrary';
import WorkOrderDetailsNavLib from '../WorkOrders/WorkOrderDetailsNav';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import pageToolbar from '../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import WorkOrderChangeStatusOptions from './MobileStatus/WorkOrderChangeStatusOptions';

export default function WorkOrderHighPriorityDetailsNav(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        return WorkOrderDetailsNavLib(context);
    }

    let pageProxy = context.getPageProxy();
    let actionBinding = pageProxy.getActionBinding();
    if (libMobile.isHeaderStatusChangeable(pageProxy)) {
        let bindingOriginal = pageProxy.binding;
        pageProxy._context.binding = actionBinding; // replace binding with action binding so that we can use WorkOrderChangeStatusOptions before we navigated to the page
        return WorkOrderChangeStatusOptions(pageProxy).then(items => {
            pageProxy._context.binding = bindingOriginal; // revert to original binding 
            return pageToolbar.getInstance().generatePossibleToolbarItems(pageProxy, items, 'WorkOrderDetailsPage').then(() => {
                return libCommon.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action', actionBinding['@odata.readLink'], libWo.getWorkOrderDetailsNavQueryOption(context));
            });
        });
    } else {
        return libCommon.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action', actionBinding['@odata.readLink'], libWo.getWorkOrderDetailsNavQueryOption(context));
    }
}

import libMobile from '../../MobileStatus/MobileStatusLibrary';
import common from '../Library/CommonLibrary';

export default function IsBusinessObjectChangeable(context) {
    const pageName = common.getPageName(context);

    switch (pageName) {
        case 'WorkOrderDetailsPage':
            return libMobile.isHeaderStatusChangeable(context);
        case 'ServiceOrderDetailsPage':
        case 'ServiceRequestDetailsPage':
        case 'ConfirmationsDetailsScreenPage':
            return libMobile.isServiceOrderStatusChangeable(context);
        default:
            return true;
    }
}

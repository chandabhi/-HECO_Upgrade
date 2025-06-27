
import libMobile from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import common from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function IsBusinessObjectChangeable(context,statusVisibileForWO=false) {
    const pageName = common.getPageName(context);

    switch (pageName) {
        case 'WorkOrderDetailsPage':
            return statusVisibileForWO || libMobile.isHeaderStatusChangeable(context);
        case 'ServiceOrderDetailsPage':
        case 'ServiceRequestDetailsPage':
        case 'ConfirmationsDetailsScreenPage':
            return libMobile.isServiceOrderStatusChangeable(context);
        default:
            return true;
    }
}



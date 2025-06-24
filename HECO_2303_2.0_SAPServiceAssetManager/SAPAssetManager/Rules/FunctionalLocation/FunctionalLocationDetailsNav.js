import common from '../Common/Library/CommonLibrary';

export default function FunctionalLocationDetailsNav(context) {

    let floc = context.getPageProxy().binding.FunctionalLocation;

    if (floc && floc['@odata.readLink']) {
        return common.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationDetailsNav.action', floc['@odata.readLink'], '$expand=WorkOrderHeader,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav');
    } else {
        let actionContext = context.getPageProxy().getActionBinding();
        if (actionContext['@odata.type'] === '#sap_mobile.S4ServiceOrderRefObj') {
            if (!actionContext.FuncLoc_Nav) return Promise.resolve();
            floc = actionContext.FuncLoc_Nav;
            return common.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationDetailsNav.action', floc['@odata.readLink'], '$expand=WorkOrderHeader,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav');
        }
        if (actionContext['@odata.type'] === '#sap_mobile.S4ServiceRequestRefObj') {
            if (!actionContext.MyFunctionalLocation_Nav) return Promise.resolve();
            floc = actionContext.MyFunctionalLocation_Nav;
            return common.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationDetailsNav.action', floc['@odata.readLink'], '$expand=WorkOrderHeader,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav');
        }

        return null;
    }
}

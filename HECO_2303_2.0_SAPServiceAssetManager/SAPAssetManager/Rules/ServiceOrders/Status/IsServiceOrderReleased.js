import GetReleasedStatusCode from '../GetReleasedStatusCode';
import ServiceOrderObjectType from '../ServiceOrderObjectType';

// checks a service order system status
// I1004 is a released status
// check is required to avoid confirmation creation issue
// confirmation create is allowed only for system released orders
export default function IsServiceOrderReleased(context, status) {
    let releasedStatusCode = GetReleasedStatusCode(context);

    if (status && status.ObjectType === ServiceOrderObjectType(context)) {
        return Promise.resolve(isSystemStatusCodeIncludesStatus(status.SystemStatusCode, releasedStatusCode));
    } else if (context.binding) {
        let link = context.binding['@odata.readLink'];
        if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
            if (context.binding.MobileStatus_Nav) {
                let mobileStatus = context.binding.MobileStatus_Nav;
                return Promise.resolve(isSystemStatusCodeIncludesStatus(mobileStatus.SystemStatusCode, releasedStatusCode));
            } else {
                return context.read('/SAPAssetManager/Services/AssetManager.service', link + '/MobileStatus_Nav', ['SystemStatusCode'], '').then(function(result) {
                    if (result.length) {
                        return isSystemStatusCodeIncludesStatus(result.getItem(0).SystemStatusCode, releasedStatusCode);
                    } else {
                        return true;
                    }
                });
            }
        } else if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
            if (context.binding.S4ServiceOrder_Nav && context.binding.S4ServiceOrder_Nav.MobileStatus_Nav) {
                let mobileStatus = context.binding.S4ServiceOrder_Nav.MobileStatus_Nav;
                return Promise.resolve(isSystemStatusCodeIncludesStatus(mobileStatus.SystemStatusCode, releasedStatusCode));
            } else {
                return context.read('/SAPAssetManager/Services/AssetManager.service', link + '/S4ServiceOrder_Nav/MobileStatus_Nav', ['SystemStatusCode'], '').then(function(result) {
                    if (result.length) {
                        return isSystemStatusCodeIncludesStatus(result.getItem(0).SystemStatusCode, releasedStatusCode);
                    } else {
                        return true;
                    }
                });
            }
        } else if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmation') {        
                return context.read('/SAPAssetManager/Services/AssetManager.service', link + '/TransHistories_Nav', [], '$expand=S4ServiceOrder_Nav/MobileStatus_Nav&$filter=sap.entityexists(S4ServiceOrder_Nav)').then(result => {
                    if (result.length) {
                        return isSystemStatusCodeIncludesStatus(result.getItem(0).S4ServiceOrder_Nav.MobileStatus_Nav.SystemStatusCode, releasedStatusCode);
                    } else {
                        return true;
                    }
                });
            }
        }

    return Promise.resolve(true);
}

function isSystemStatusCodeIncludesStatus(codesString, status) {
    return (codesString && codesString.includes) ? codesString.includes(status) : true;
}

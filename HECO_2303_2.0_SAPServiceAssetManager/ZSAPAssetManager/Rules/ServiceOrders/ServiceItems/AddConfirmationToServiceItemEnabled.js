import S4ServiceLibrary from '../S4ServiceLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsServiceOrderReleased from '../Status/IsServiceOrderReleased';

export default function AddConfirmationToServiceItemEnabled(context) {
    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    
    let promises = [];
    // checks if current object is completed
    promises.push(S4ServiceLibrary.isServiceObjectCompleted(context, context.binding, context.binding.MobileStatus_Nav)); 
    
    // checks if parrent object is completed
    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/S4ServiceOrder_Nav', [], '$expand=MobileStatus_Nav'));
    } else {
        promises.push(Promise.resolve(false));
    }
    
    // retrives all related confirmations
    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmation') {
        promises.push(Promise.resolve([]));
    } else {
        let query = '$expand=S4ServiceConfirms_Nav/MobileStatus_Nav&$filter=sap.entityexists(S4ServiceConfirms_Nav)';
        let entity = 'S4ServiceConfirmationTranHistories';
        if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
            entity = context.binding['@odata.readLink'] + '/TransHistories_Nav';
        } else if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
            entity = context.binding['@odata.readLink'] + '/S4ServiceOrder_Nav/TransHistories_Nav';
        }

        promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], query));
    }
    promises.push(IsServiceOrderReleased(context));

    return Promise.all(promises).then(results => {
        let isObjectCompleted = results[0]; // current object is completed
        let parentObjectCompleted = results[1]; // checks if parrent object is completed
        if (parentObjectCompleted && parentObjectCompleted.getItem) {
            let parentMobileStatus = parentObjectCompleted.getItem(0).MobileStatus_Nav;
            parentObjectCompleted = parentMobileStatus ? parentMobileStatus.MobileStatus === COMPLETED : false;
        }

        if (isObjectCompleted || parentObjectCompleted) return false;

        let isServiceOrderReleased = results[3];
        if (!isServiceOrderReleased) return false;

        let confirmations = results[2];
        let isConfirmationFinalAndCompleted = confirmations.some(confirmation => {
            if (confirmation) {
                let mobileStatus = confirmation.S4ServiceConfirms_Nav.MobileStatus_Nav;
                return confirmation.S4ServiceConfirms_Nav.FinalConfirmation === 'X' && mobileStatus && mobileStatus.MobileStatus === COMPLETED;
            }
            return false;
        });

        return !isConfirmationFinalAndCompleted;
    });
}

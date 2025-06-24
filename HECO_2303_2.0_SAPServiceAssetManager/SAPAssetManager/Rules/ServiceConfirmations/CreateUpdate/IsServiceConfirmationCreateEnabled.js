import IsServiceOrderReleased from '../../ServiceOrders/Status/IsServiceOrderReleased';

export default function IsServiceConfirmationCreateEnabled(context) {
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        return IsServiceOrderReleased(context).then(isReleased => {
            return isReleased; 
        }).catch(function() {
            return true;
        });
    }

    return true;
}

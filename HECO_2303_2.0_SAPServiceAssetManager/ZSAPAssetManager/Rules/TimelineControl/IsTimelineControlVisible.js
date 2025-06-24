import common from '../Common/Library/CommonLibrary';
import personaLib from '../Persona/PersonaLibrary';
import isServiceItem from '../ServiceOrders/ServiceItems/IsServiceItemCategory';
export default function IsTimelineControlVisible(context) {
    let isVisible = false;
    ///Enable control Visibility based on FSM persona and assigment type
    let entityset = common.getEntitySetName(context);
    switch (entityset) {
        case 'MyWorkOrderHeaders':       
            isVisible = (common.getWorkOrderAssnTypeLevel(context) === 'Header' && personaLib.isFieldServiceTechnician(context));
            break;
        case 'MyWorkOrderOperations':
            isVisible = (common.getWorkOrderAssnTypeLevel(context) === 'Operation' && personaLib.isFieldServiceTechnician(context));
            break;
        case 'MyWorkOrderSubOperations':
            isVisible = (common.getWorkOrderAssnTypeLevel(context) === 'SubOperation' && personaLib.isFieldServiceTechnician(context));
            break;
        case 'S4ServiceOrders':
        case 'S4ServiceRequests':
            isVisible = (common.getS4AssnTypeLevel(context) === 'Header' && personaLib.isFieldServiceTechnician(context));
            break;
        case 'S4ServiceItems':
            isVisible = (common.getS4AssnTypeLevel(context) === 'Item' && personaLib.isFieldServiceTechnician(context) && isServiceItem(context));
            break;
        default:
            break;
    }
    return isVisible;
}

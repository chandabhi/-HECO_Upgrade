import IsMeterComponentEnabled from '../../ComponentsEnablement/IsMeterComponentEnabled';
import IsServiceOrder from './IsServiceOrder';
import PersonaLibrary from '../../Persona/PersonaLibrary';

/**
 * Checks if SoldToPartySection should be visable or not in WorkOrderDetails.page.
 * 
 * @param {*} context
 * @returns true - If meter is enabled or if the order object from context is of type service order and active persona not WCM operator.
 */
export default function SoldToPartySectionIsVisible(context) {
    return !PersonaLibrary.isWCMOperator(context) && (IsMeterComponentEnabled(context) || IsServiceOrder(context));
}

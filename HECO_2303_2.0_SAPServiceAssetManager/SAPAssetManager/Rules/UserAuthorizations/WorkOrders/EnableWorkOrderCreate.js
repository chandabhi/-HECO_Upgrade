/**
* Show/Hide Work Order create button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import libPersona from '../../Persona/PersonaLibrary';

export default function EnableWorkOrderCreate(context) {
    let auth = isUserAuthorizedToCreateWO(context);

    if (libPersona.isWCMOperator(context)) {
        return Promise.resolve(false);
    }
    return Promise.resolve(auth);
}

/**
 * 
 * @param {*} context 
 * @returns WO Create authorization
 */
export function isUserAuthorizedToCreateWO(context) {
    return libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.WO.Create') === 'Y';
}

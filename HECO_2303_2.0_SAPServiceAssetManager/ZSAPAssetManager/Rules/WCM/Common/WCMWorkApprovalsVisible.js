import PersonaLibrary from '../../Persona/PersonaLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WCMWorkApprovalsVisible(context) {
    return PersonaLibrary.isWCMOperator(context) && CommonLibrary.getAppParam(context, 'WCM', 'Approval.Show') === 'Y';
}

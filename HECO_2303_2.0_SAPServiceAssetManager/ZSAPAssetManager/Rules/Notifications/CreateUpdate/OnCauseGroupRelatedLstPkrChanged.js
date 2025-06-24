import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import UpdateCauseGroupEditable from './UpdateCauseGroupEditable';

export default function OnCauseGroupRelatedLstPkrChanged(context) {
    // 'Cause Group' is allowed for input only if DamageDetailsLstPkr || PartDetailsLstPkr entity was entered or exists
    ResetValidationOnInput(context);
    UpdateCauseGroupEditable(context);
}


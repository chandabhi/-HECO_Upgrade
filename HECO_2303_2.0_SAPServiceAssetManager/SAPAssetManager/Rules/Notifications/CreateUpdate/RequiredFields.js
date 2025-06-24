import failureModeGroupValue from './NotificationCreateUpdateQMCodeGroupValue';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function RequiredFields(context) {
    const required = ['NotificationDescription', 'TypeLstPkr'];

    // eslint-disable-next-line brace-style
    if ((function() { try { return context.evaluateTargetPathForAPI('#Control:PartnerPicker1').visible; } catch (exc) { return false; } })()) {
        required.push('PartnerPicker1');
    }

    // eslint-disable-next-line brace-style
    if ((function() { try { return context.evaluateTargetPathForAPI('#Control:PartnerPicker2').visible; } catch (exc) { return false; } })()) {
        required.push('PartnerPicker2');
    }

    //If a Failure Mode Group has been entered then Failure Mode Code is required or else backend will throw an error
    if (failureModeGroupValue(context)) {
        required.push('QMCodeListPicker');
    }

    const formcellContainerProxy = context.getPageProxy().getControl('FormCellContainer');

    required.push(...NotificationItemRequiredFields(formcellContainerProxy), ...NotificationItemCauseRequiredFields(formcellContainerProxy), ...NotificationItemDetectionRequiredFields(formcellContainerProxy));

    return required;
}

export function NotificationItemRequiredFields(formcellContainerProxy) {
    return GetUnpopulatedChildControlNamesWithPopulatedParentControl([
        ['PartGroupLstPkr', 'PartDetailsLstPkr'],  // If 'Part Group' is entered, 'Part' should be mandatory
        ['DamageGroupLstPkr', 'DamageDetailsLstPkr']],  // if 'Damage Group' is entered, 'Damage' should be mandatory
        formcellContainerProxy);
}

export function NotificationItemCauseRequiredFields(formcellContainerProxy) {
    return GetUnpopulatedChildControlNamesWithPopulatedParentControl([['CauseGroupLstPkr', 'CodeLstPkr']], formcellContainerProxy);  // if 'Cause Group' is entered, 'Cause Code' should be mandatory
}

export function NotificationItemDetectionRequiredFields(formcellContainerProxy) {
    return GetUnpopulatedChildControlNamesWithPopulatedParentControl([['DetectionGroupListPicker', 'DetectionMethodListPicker']], formcellContainerProxy); //If a detection group has been entered then the method is required
}

function GetUnpopulatedChildControlNamesWithPopulatedParentControl(parentChildControlNames, formcellContainerProxy) {
    return parentChildControlNames.filter(([parentName, _]) => isControlPopulated(parentName, formcellContainerProxy))  // eslint-disable-line no-unused-vars
        .map(([_, childName]) => childName);  // eslint-disable-line no-unused-vars
}

export function isControlPopulated(controlName, formcellContainerProxy) {
    return !ValidationLibrary.evalIsEmpty(formcellContainerProxy.getControl(controlName).getValue());
}

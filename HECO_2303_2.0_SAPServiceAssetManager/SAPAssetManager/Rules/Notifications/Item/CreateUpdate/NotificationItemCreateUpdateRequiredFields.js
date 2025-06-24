import { NotificationItemRequiredFields, isControlPopulated } from '../../CreateUpdate/RequiredFields';

export default function NotificationItemCreateUpdateRequiredFields(context) {
    const formcellContainerProxy = context.getPageProxy().getControl('FormCellContainer');
    const requiredFields = NotificationItemRequiredFields(formcellContainerProxy);
    const parentPickerNames = ['PartGroupLstPkr', 'DamageGroupLstPkr'];
    const anyRequiredFields = ['ItemDescription', ...parentPickerNames];

    if (anyRequiredFields.map(controlName => isControlPopulated(controlName, formcellContainerProxy)).every(i => !i)) {  // if none of the description, part or damage picker are filled out, make them required
        requiredFields.push(...anyRequiredFields);
    }
    return requiredFields;
}

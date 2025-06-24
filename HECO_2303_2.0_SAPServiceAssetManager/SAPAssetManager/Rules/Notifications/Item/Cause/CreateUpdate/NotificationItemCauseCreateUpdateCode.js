import ResetValidationOnInput from '../../../../Common/Validation/ResetValidationOnInput';
import notification from '../../../NotificationLibrary';

export default function NotificationItemTaskCreateUpdateCode(context) {
    ResetValidationOnInput(context);
    return notification.NotificationTaskActivityCreateUpdateCode(context, 'CatTypeCauses');
}

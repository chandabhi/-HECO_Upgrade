import MobileStatusUpdateOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';

export default function NotificationChangeStatusOptions(context) {
    let binding = context.binding;

    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const onSuccessAction = '/SAPAssetManager/Rules/Notifications/MobileStatus/NotificationMobileStatusUpdateOnSuccess.js';

    if (IsPhaseModelEnabled(context) && MobileStatusLibrary.getMobileStatus(binding, context) === STARTED) {
        return Promise.resolve([{ 'Title': context.localizeText('complete_notification'), 'OnPress': '/SAPAssetManager/Rules/Notifications/MobileStatus/NotificationCompletePhaseModel.js' }]);
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/NotifMobileStatus_Nav`, [], '$expand=OverallStatusCfg_Nav').then(rollback => {
        //Save mobile status in the page's client data using key 'PhaseModelRollbackStatus'
        CommonLibrary.setStateVariable(context, 'PhaseModelRollbackStatus', rollback.getItem(0));
        let queryOptions = IsPhaseModelEnabled(context) ? '$expand=NextOverallStatusCfg_Nav' : `$filter=UserPersona eq '${PersonaLibrary.getActivePersona(context)}'&$expand=NextOverallStatusCfg_Nav`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/NotifMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav`, [], queryOptions).then(codes => {
            let popoverItems = [];

            codes.forEach(element => {
                // Go through each available next status and create a PopoverItems array
                let statusElement = element.NextOverallStatusCfg_Nav;
                let transitionText;

                // If there is a TranslationTextKey available, use that for the popover item. Otherwise, use the OverallStatusLabel.
                if (statusElement.TransitionTextKey) {
                    transitionText = context.localizeText(statusElement.TransitionTextKey);
                } else {
                    transitionText = statusElement.OverallStatusLabel;
                }

                // Add items to possible transitions list
                if (statusElement.MobileStatus === COMPLETED) {
                    // Save statusElement since we can't pass it as a parameter to this rule
                    CommonLibrary.setStateVariable(context, 'StatusElement', statusElement);
                    // Prepend warning dialog to complete status change
                    popoverItems.push({
                        'Title': transitionText, 'OnPress': {
                            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                            'Properties': {
                                'Title': context.localizeText('confirm_status_change'),
                                'Message': context.localizeText('notification_complete_warning'),
                                'OKCaption': context.localizeText('ok'),
                                'CancelCaption': context.localizeText('cancel'),
                                'OnOK': '/SAPAssetManager/Rules/Notifications/MobileStatus/NotificationMobileStatusComplete.js',
                            },
                        },
                        'Enabled': '/SAPAssetManager/Rules/Notifications/MobileStatus/CanNotificationMobileStatusComplete.js',
                    });
                } else {
                    // Add all other items to possible transitions as-is
                    popoverItems.push({ 'Title': transitionText, 'OnPress': MobileStatusUpdateOverride(context, statusElement, 'NotifMobileStatus_Nav', onSuccessAction) });
                }
            });

            if (codes.length > 0) {
                return popoverItems;
            } else {
                return Promise.resolve([]);
            }
        });
    });
}


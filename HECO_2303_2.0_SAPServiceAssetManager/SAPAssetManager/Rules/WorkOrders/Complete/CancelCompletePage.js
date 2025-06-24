import libCom from '../../Common/Library/CommonLibrary';
import RemoveCreatedExpenses from '../../Expense/List/RemoveCreatedExpenses';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import Logger from '../../Log/Logger';
import RedrawCompletePage from './RedrawCompletePage';

export default function CancelCompletePage(context) {
    try {
        var resetActions = [];
        resetActions.push(RemoveCreatedExpenses(context));

        if (WorkOrderCompletionLibrary.getStepValue(context, 'mileage')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context,
                WorkOrderCompletionLibrary.getStepDataLink(context, 'mileage')));
        
            WorkOrderCompletionLibrary.updateStepState(context, 'mileage', {
                value: '',
                data: '',
                link: '',
            });
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'lam')) {
            WorkOrderCompletionLibrary.updateStepState(context, 'lam', {
                value: '',
                data: '',
                lam: '',
            });

            resetActions.push(WorkOrderCompletionLibrary.resetStep(context, 
                WorkOrderCompletionLibrary.getStepDataLink(context, 'lam')));
        }
    
        if (WorkOrderCompletionLibrary.getStepValue(context, 'notification')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context, 
                WorkOrderCompletionLibrary.getStepDataLink(context, 'notification')));
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'time')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context, 
                WorkOrderCompletionLibrary.getStepDataLink(context, 'time')));
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'confirmation')) {
            let order = WorkOrderCompletionLibrary.getInstance().getBinding(context);
            let confirmationLink = WorkOrderCompletionLibrary.getStepDataLink(context, 'confirmation');

            //delete a transaction between order and confirmation, delete confirmation item and confirmation
            resetActions.push(context.read('/SAPAssetManager/Services/AssetManager.service', confirmationLink + '/TransHistories_Nav', [], `$filter=sap.islocal() and RelatedObjectID eq '${order.ObjectID}'`).then(result => {
                if (result.length) {
                    return WorkOrderCompletionLibrary.resetStep(context, result.getItem(0)['@odata.readLink']).then(() => {
                        return context.read('/SAPAssetManager/Services/AssetManager.service', confirmationLink + '/ServiceConfirmationItems_Nav', [], '$filter=sap.islocal()').then(items => {
                            if (items.length) {
                                return WorkOrderCompletionLibrary.resetStep(context, items.getItem(0)['@odata.readLink']).then(() => {
                                    return WorkOrderCompletionLibrary.resetStep(context, confirmationLink);
                                });
                            }
                            return WorkOrderCompletionLibrary.resetStep(context, confirmationLink);
                        });
                    });
                }
                return WorkOrderCompletionLibrary.resetStep(context, confirmationLink);
            }));
        } else if (WorkOrderCompletionLibrary.getStepValue(context, 'confirmation_item')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context, 
                WorkOrderCompletionLibrary.getStepDataLink(context, 'confirmation_item')));
        }


        if (WorkOrderCompletionLibrary.getStepValue(context, 'digit_signature')) {
            resetActions.push(context.executeAction({'Name': 
                '/SAPAssetManager/Actions/OData/DigitalSignature/DeleteDraftSignatureFromUserPrefs.action',
                'Properties': {
                    'Target': {
                        'ReadLink': WorkOrderCompletionLibrary.getStepDataLink(context, 'digit_signature'),
                    },
                },
            }));
            WorkOrderCompletionLibrary.updateStepState(context, 'digit_signature', {
                value: '',
                link: '',
            });
        }

        if (WorkOrderCompletionLibrary.getStepValue(context, 'signature')) {
            resetActions.push(WorkOrderCompletionLibrary.resetStep(context, 
                WorkOrderCompletionLibrary.getStepDataLink(context, 'signature')));
        
            WorkOrderCompletionLibrary.updateStepState(context, 'signature', {
                value: '',
                link: '',
            });
        }

        return Promise.all(resetActions).then(() => {
            libCom.setStateVariable(context, 'expenses', []);
            libCom.removeBindingObject(context);
            libCom.removeStateVariable(context, 'contextMenuSwipePage');
            WorkOrderCompletionLibrary.resetValidationMessages(context);
            RedrawCompletePage(context);
            WorkOrderCompletionLibrary.clearSteps(context);
            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(context, false);
            WorkOrderCompletionLibrary.getInstance().deleteBinding(context);
            return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
        });
    } catch (failure) {
        Logger.error('Reset confirmation failed', failure);
    }
}

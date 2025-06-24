import libCommon from '../../Common/Library/CommonLibrary';
import LocationUpdate from '../../MobileStatus/LocationUpdate';
export default function OperationMobileStatusSuccessMessage(context) {
    LocationUpdate(context);
    context.dismissActivityIndicator();
    var clientData = context.getClientData();
    if (clientData) {
        if (clientData.ChangeStatus) {
            var status = clientData.ChangeStatus;
            var oprStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            var oprHold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
            var oprTransfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
            var oprComplete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            var oprReview = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
            var oprDisapprove = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
            var oprApprove = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());
            switch (status) {
                case oprStarted:
                    return context.localizeText('operation_started');
                case oprHold:
                    return context.localizeText('operation_on_hold');
                case oprTransfer:
                    return context.localizeText('operation_transferred');
                case oprComplete:
                    return context.localizeText('operation_completed');
                case oprReview:
                    return context.localizeText('operation_review');
                case oprApprove:
                    return context.localizeText('operation_approved');
                case oprDisapprove:
                    return context.localizeText('operation_disapproved');
                default:
                    return context.localizeText('status_updated');
            }
        }
        return context.localizeText('status_updated');
    }
}

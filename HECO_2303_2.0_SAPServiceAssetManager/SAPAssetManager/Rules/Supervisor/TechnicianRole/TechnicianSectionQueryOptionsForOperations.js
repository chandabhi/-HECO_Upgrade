import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function TechnicianSectionQueryOptionsForOperations(context) {
    let review = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    let disapproved = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
    let approved = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());

    return libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, "$expand=WOHeader,OperationMobileStatus_Nav&$filter=(OperationMobileStatus_Nav/MobileStatus eq '" + review + "' or OperationMobileStatus_Nav/MobileStatus eq '" + disapproved + "' or OperationMobileStatus_Nav/MobileStatus eq '" + approved + "')&$top=4");
}


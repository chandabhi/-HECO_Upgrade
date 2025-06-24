import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function TechnicianSectionQueryOptionsForWO(context) {
    let review = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    let disapproved = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
    let approved = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());

    const queryOptions = "$expand=OrderMobileStatus_Nav&$filter=(OrderMobileStatus_Nav/MobileStatus eq '" + review + "' or OrderMobileStatus_Nav/MobileStatus eq '" + disapproved + "' or OrderMobileStatus_Nav/MobileStatus eq '" + approved + "')&$top=4";
    return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions);
}

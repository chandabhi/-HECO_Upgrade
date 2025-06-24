import DocLib from '../DocumentLibrary';

export default function DocumentsBDSCount(controlProxy) {
    let value = 0;
    let id = '';
    let operation_num = '';
    let item_num = '';
    switch (DocLib.lookupParentObjectType(controlProxy, controlProxy.getPageProxy().binding['@odata.type'])) {
        case DocLib.ParentObjectType.WorkOrder:
            id = controlProxy.getPageProxy().binding.OrderId;
            value = DocLib.getDocumentCount(controlProxy, 'MyWorkOrderDocuments', "$expand=Document&$filter=OrderId eq '" + id + "' and (OperationNo eq null or OperationNo eq '') and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.Notification:
            id = controlProxy.getPageProxy().binding.NotificationNumber;
            value = DocLib.getDocumentCount(controlProxy, 'MyNotifDocuments', "$expand=Document&$filter=NotificationNumber eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.Equipment:
            id = controlProxy.getPageProxy().binding.EquipId;
            value = DocLib.getDocumentCount(controlProxy, 'MyEquipDocuments', "$expand=Document&$filter=EquipId eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.FunctionalLocation:
            id = controlProxy.getPageProxy().binding.FuncLocIdIntern;
            value = DocLib.getDocumentCount(controlProxy, 'MyFuncLocDocuments', "&$expand=Document&$filter=FuncLocIdIntern eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.Operation:
            id = controlProxy.getPageProxy().binding.OrderId;
            operation_num = controlProxy.getPageProxy().binding.OperationNo;
            value = DocLib.getDocumentCount(controlProxy, 'MyWorkOrderDocuments', "$expand=Document&$filter=OrderId eq '" + id + "' and OperationNo eq '" + operation_num + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.WCMDocumentHeader:
            id = controlProxy.getPageProxy().binding.WCMDocument;
            value = DocLib.getDocumentCount(controlProxy, 'WCMDocumentHeaderAttachments', "$expand=Document&$filter=WCMDocument eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.WCMApproval:
            id = controlProxy.getPageProxy().binding.WCMApproval;
            value = DocLib.getDocumentCount(controlProxy, 'WCMApprovalAttachments', "$expand=Document&$filter=WCMApproval eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.WCMApplication:
            id = controlProxy.getPageProxy().binding.WCMApplication;
            value = DocLib.getDocumentCount(controlProxy, 'WCMApplicationAttachments', "$expand=Document&$filter=WCMApplication eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.WCMDocumentItem:
            value = GetWCMDocumentItemBDSCount(controlProxy, controlProxy.getPageProxy().binding);
            break;
        case DocLib.ParentObjectType.S4ServiceOrder:
            id = controlProxy.getPageProxy().binding.ObjectID;
            value = DocLib.getDocumentCount(controlProxy, 'S4ServiceOrderDocuments', "$expand=Document&$filter=HeaderID eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.S4ServiceItem:
            id = controlProxy.getPageProxy().binding.ObjectID;
            item_num = controlProxy.getPageProxy().binding.ItemNo;
            value = DocLib.getDocumentCount(controlProxy, 'S4ServiceOrderDocuments', "$expand=Document&$filter=ObjectID eq '" + id + "' and ItemNo eq '" + item_num + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.InspectionLot:
            id = controlProxy.getPageProxy().binding.InspectionLot;
            value = DocLib.getDocumentCount(controlProxy, 'InspectionLotDocuments', "$expand=Document&$filter=InspectionLot eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.S4ServiceRequest:
            id = controlProxy.getPageProxy().binding.ObjectID;
            value = DocLib.getDocumentCount(controlProxy, 'S4ServiceRequestDocuments', "$expand=Document&$filter=HeaderID eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.S4ServiceConfirmation:
            id = controlProxy.getPageProxy().binding.ObjectID;
            value = DocLib.getDocumentCount(controlProxy, 'S4ServiceConfirmationDocuments', "$expand=Document&$filter=HeaderID eq '" + id + "' and " + DocLib.getDocumentFilter());
            break;
        case DocLib.ParentObjectType.S4ServiceConfirmationItem:
            id = controlProxy.getPageProxy().binding.ObjectID;
            item_num = controlProxy.getPageProxy().binding.ItemNo;
            value = DocLib.getDocumentCount(controlProxy, 'S4ServiceConfirmationDocuments', "$expand=Document&$filter=ObjectID eq '" + id + "' and ItemNo eq '" + item_num + "' and " + DocLib.getDocumentFilter());
            break;
        default:
            break;
    }
    return value;
}

function GetWCMDocumentItemBDSCount(context, wcmDocumentItem) {
    return DocLib.getDocumentCount(context, 'WCMDocumentItemAttachments', `$expand=Document&$filter=WCMDocument eq '${wcmDocumentItem.WCMDocument}' and WCMDocumentItem eq '${wcmDocumentItem.WCMDocumentItem}' and ${DocLib.getDocumentFilter()}`);
}

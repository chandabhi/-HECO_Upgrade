import ComLib from '../Common/Library/CommonLibrary';
import DocLib from './DocumentLibrary';
import Logger from '../Log/Logger';
import { WorkOrderLibrary as libWo } from '../WorkOrders/WorkOrderLibrary';
import NotifLib from '../Notifications/NotificationLibrary';
import DocumentPath from './DocumentPath';
import Base64Library from '../Common/Library/Base64Library';
import IsAndroid from '../Common/IsAndroid';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import NativeScriptObject from '../Common/Library/NativeScriptObject';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';

export default class {
    /**
     * Checks to see if the work order from context is marked or not.
     * @param {*} clientAPI
     * @return {Promise} a promise of true if media is local.
     *
     * @memberof DocumentEventLibrary
     */
    static isMediaLocal(clientAPI, path) {
        let binding = clientAPI.binding;

        let objectType;
        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
            objectType = binding.PRTDocument.ObjectType;
        } else {
            objectType = binding.Document.ObjectType;
        }

        if (objectType === 'URL') {
            // Special case for URL documents: always assume media is "local"
            return Promise.resolve(true);
        } else {
            const readLink = ComLib.getTargetPathValue(clientAPI, path);
            const entitySet = readLink.split('(')[0];
            /**Implementing our Logger class*/
            Logger.debug(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), readLink);
            Logger.debug(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), entitySet);
            return clientAPI.isMediaLocal('/SAPAssetManager/Services/AssetManager.service', entitySet, readLink);
        }
    }

    /**
     * Formats the file size is a more readable way
     * @param {string} rawFileSize the size from the document object as a string
     * @return {Promise} a promise of true if media is local.
     *
     * @memberof DocumentEventLibrary
     */
    static formatFileSize(rawFileSize) {
        if (rawFileSize) {
            const intValue = parseInt(rawFileSize);
            if (intValue > (1024 * 1024 * 1024)) {
                return Math.round(intValue / (1024 * 1024 * 10.24)) / 100 + ' GB';
            } else if (intValue > (1024 * 1024)) {
                return Math.round(intValue / (1024 * 10.24)) / 100 + ' MB';
            } else if (intValue > 1024) {
                return Math.round(intValue / 10.24) / 100 + ' KB';
            } else {
                if (intValue === 0) {
                    return '-';
                }
                return intValue;
            }
        }
        return '-';
    }

    /**
     * Helper function to get the count of the documents
     * @param {*} clientAPI
     * @param {string} documentCollectionName the name of the collection of document links
     * @return {Promise} a promise with the count number
     *
     * @memberof DocumentEventLibrary
     */
    static getDocumentCount(clientAPI, entitySet, queryOptions) {
        /**Implementing our Logger class*/
        Logger.debug(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'entitySet: ' + entitySet + 'queryOption: ' + queryOptions);
        return ComLib.getEntitySetCount(clientAPI, entitySet, queryOptions);
    }
    /**
     * Helper function to remap the linked documents into an array
     * @param {*} clientAPI
     * @param {string} documentCollectionName the name of the collection of document links
     * @param {string} documentPropertyName the property that contains the linked document
     * @return {Promise} a promise with an array of documents
     *
     * @memberof DocumentEventLibrary
     */
    static getRemappedDocuments(clientAPI, documentCollectionName, documentPropertyName) {
        let odataId = ComLib.getTargetPathValue(clientAPI.getPageProxy(), '#Property:@odata.id');
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service',
            odataId + '/' + documentCollectionName,
            [],
            '$expand=' + documentPropertyName).then((resultSet) => {
                let documents = [];
                resultSet.map((value) => {
                    const document = value[documentPropertyName];
                    if (document) {
                        documents.push(document);
                    }
                    return document;
                });

                return documents;
            });
    }

    /**
     * helper function to get the parent object type
     * @param {*} clientAPI
     * @return {string} the type of the parent object as found in ParentObjectType. Returns the raw @odata.type if
     *                  the type is not found in ParentObjectType.
     *
     * @memberof DocumentEventLibrary
     */
    static getParentObjectType(clientAPI) {
        const odataType = clientAPI.binding['@odata.type'];
        return DocLib.lookupParentObjectType(clientAPI, odataType);
    }

    static lookupParentObjectType(clientAPI, odataType) {
        const workorderType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeWorkOrder.global').getValue();
        const notificationType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeNotification.global').getValue();
        const equipmentType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeEquipment.global').getValue();
        const functionallocationType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeFunctionalLocation.global').getValue();
        const operation = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeOperation.global').getValue();
        const suboperation = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeSubOperation.global').getValue();
        const confirmation = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeConfirmation.global').getValue();
        const confirmationRow = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeConfirmationRow.global').getValue();
        const safetyCertificates = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentSafetyCertificatesODataType.global').getValue();
        const wcmApprovalType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeWCMApproval.global').getValue();
        const serviceItemType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeServiceItem.global').getValue();
        const wcmApplicationType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeWCMApplication.global').getValue();
        const wcmDocumentItem = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeWCMDocumentItem.global').getValue();
        const checklistType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeChecklist.global').getValue();

        let value = odataType;

        switch (odataType) {
            case workorderType:
                value = DocLib.ParentObjectType.WorkOrder;
                break;
            case notificationType:
                value = DocLib.ParentObjectType.Notification;
                break;
            case equipmentType:
                value = DocLib.ParentObjectType.Equipment;
                break;
            case functionallocationType:
                value = DocLib.ParentObjectType.FunctionalLocation;
                break;
            case operation:
                try {
                    if (clientAPI.evaluateTargetPathForAPI('#Page:CreateUpdatePage')) {
                        value = DocLib.ParentObjectType.InspectionLot;
                        break;
                    }
                } catch (error) {
                    Logger.debug(error);
                }
                value = DocLib.ParentObjectType.Operation;
                break;
            case suboperation:
                value = DocLib.ParentObjectType.SubOperation;
                break;
            case safetyCertificates:
                value = DocLib.ParentObjectType.WCMDocumentHeader;
                break;
            case wcmDocumentItem:
                value = DocLib.ParentObjectType.WCMDocumentItem;
                break;
            case confirmation:
            case confirmationRow:
                if (ComLib.getStateVariable(clientAPI, 'FinalConfirmationIsCompletingWorkOrder')) {
                    value = DocLib.ParentObjectType.WorkOrder;
                } else {
                    value = DocLib.ParentObjectType.Operation;
                }
                break;
            case wcmApprovalType:
                value = DocLib.ParentObjectType.WCMApproval;
                break;
            case serviceItemType:
                value = DocLib.ParentObjectType.S4ServiceItem;
                break;
            case wcmApplicationType:
                value = DocLib.ParentObjectType.WCMApplication;
                break;
            case '#sap_mobile.InspectionPoint':
            case '#sap_mobile.InspectionLot':
            case '#sap_mobile.InspectionCharacteristic':
            case checklistType:
                value = DocLib.ParentObjectType.InspectionLot;
                break;
            case '#sap_mobile.S4ServiceItem':
                value = DocLib.ParentObjectType.S4ServiceItem;
                break;
            case '#sap_mobile.S4ServiceOrder':
                value = DocLib.ParentObjectType.S4ServiceOrder;
                break;
            case '#sap_mobile.S4ServiceRequest':
                value = DocLib.ParentObjectType.S4ServiceRequest;
                break;
            case '#sap_mobile.S4ServiceConfirmation':
                value = DocLib.ParentObjectType.S4ServiceConfirmation;
                break;
            case '#sap_mobile.S4ServiceConfirmationItem':
                value = DocLib.ParentObjectType.S4ServiceConfirmationItem;
                break;
            default:
                // its something else, just return the value
                break;
        }

        return value;
    }

    /**
     * validation rule of Document Create action
     *
     * @static
     * @param {IPageProxy} pageProxy
     * @return {Promise} boolean, true if validation passes
     *
     * @memberof DocumentEventLibrary
     */
    static createValidationRule(pageProxy) {
        let valPromises = [];
        let container = pageProxy.getControl('FormCellContainer');
        let descriptionCtrl = container.getControl('AttachmentDescription');
        let charLimitInt = pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentDescriptionMaximumLength.global').getValue();
        let attachmentCtrl = container.getControl('Attachment');

        // get all of the validation promises
        if (descriptionCtrl) {
            //Clear previous inline errors if any
            descriptionCtrl.clearValidation();
            valPromises.push(DocLib.validationCharLimit(pageProxy, descriptionCtrl, charLimitInt));
            valPromises.push(DocLib.validationMinimumCount(pageProxy, attachmentCtrl, descriptionCtrl, 1));
        } else {
            valPromises.push(DocLib.validationMinimumCount(pageProxy, attachmentCtrl, attachmentCtrl, 1));
        }
        // check all validation promises;
        // if all resolved -> return true
        // if at least 1 rejected -> return false
        return Promise.all(valPromises).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }

    /**
     * validation rule that return wether it passes the character limit (inclusive)
     *
     * @static
     * @param {IPageProxy} context
     * @param {IControl} control
     * @param {number} maximumLength
     * @return {Promise}
     *
     * @memberof DocumentEventLibrary
     */
    static validationCharLimit(context, control, maximumLength) {
        let descriptionValue = control.getValue();
        let controlHasDefinedValue = ComLib.isDefined(descriptionValue);
        let attachmentValue = context.getControl('FormCellContainer').getControl('Attachment').getValue();
        let urlSubString = '';
        if (IsAndroid(context)) {
            urlSubString = 'android';
        } else {
            urlSubString = 'private';
        }
        for (let x = 0; x < attachmentValue.length; x ++) {
            if (attachmentValue[x].urlString.indexOf(urlSubString) !== -1 && !controlHasDefinedValue) {
                let message = context.localizeText('validation_document_description_should_not_be_empty');
                ComLib.executeInlineControlError(context, control, message);
                return Promise.reject(false);
            }
        }
        if (controlHasDefinedValue && descriptionValue.length >= maximumLength) {
            let dynamicParams = [maximumLength.toString()];
            let message = context.localizeText('validation_maximum_field_length', dynamicParams);
            ComLib.executeInlineControlError(context, control, message);
            return Promise.reject(false);
        } else {
            return Promise.resolve(true);
        }
    }

    /**
    * validation rule that return wether it passes the size minimum limit (inclusive)
    *
    * @static
    * @param {IPageProxy} context
    * @param {IControl} control the control with the value to check
    * @param {IControl} errorControl the control to show errors on. Workaround for missing error field on the attachment control
    * @param {number} minimumLength
    * @return {Promise}
    *
    * @memberof DocumentEventLibrary
    */
    static validationMinimumCount(context, control, errorControl, minimumLength) {
        let attachmentCount = control.getValue().length;
        if (attachmentCount >= minimumLength) {
            return Promise.resolve(true);
        } else {
            let dynamicParams = minimumLength.toString();
            let message = context.localizeText('validation_minimum_number_of_attachments',dynamicParams);

            ComLib.executeInlineControlError(context, errorControl, message);

            return Promise.reject(false);
        }
    }

    /**
     * returns the count of attachments on the current page's FormCellContainer -> Attachment control. Zero if there is an error
     * useful for checking the count from other object add pages
     *
     * @static
     * @param {IPageProxy} pageProxy
     * @return {number} the number of attachments
     *
     * @memberof DocumentEventLibrary
     */
    static validationAttachmentCount(pageProxy) {
        let value = 0;
        try {
            const control = pageProxy.getControl('FormCellContainer').getControl('Attachment');
            value = control.getValue().length;
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(),'Error getting attachment count: ' + err);

        }
        value = value === undefined ? 0 : value;
        return value;
    }

     /**
     * checks to see if an attachment description has been added or if a file has been attached during the creation of
     * a workorder or a notification
     *
     * @static
     * @param {IPageProxy} pageProxy
     * @return {boolean}
     *
     */
    static attachmentSectionHasData(pageProxy) {
        const descriptionCtrl = pageProxy.getControl('FormCellContainer').getControl('AttachmentDescription');
        if (descriptionCtrl && (descriptionCtrl.getValue() || DocLib.validationAttachmentCount(pageProxy) > 0)) {
            return true;
        }
        return false;
    }

    /**
     * retrieves the appropriate ClassName to be used when documents are created for
     * this object type
     *
     * @static
     * @param {ClientAPI} clientAPI
     * @return {string} the class name or empty string if not found
     *
     * @memberof DocumentEventLibrary
     */
    static getBDSClassName(clientAPI) {
        let value = ComLib.getAppParam(clientAPI, 'BDSDOCUMENT', DocLib.getParentObjectType(clientAPI));
        if (value) {
            return value;
        }
        return '';
    }

    /**
     * retrieves the appropriate ObjectLink to be used when documents are created for
     * this object type
     *
     * @static
     * @param {ClientAPI} clientAPI
     * @return {string} the object link or empty string if not found
     *
     * @memberof DocumentEventLibrary
     */
    static getObjectLink(clientAPI) {
        switch (DocLib.getParentObjectType(clientAPI)) {
            case DocLib.ParentObjectType.WorkOrder:
                return libWo.isServiceOrder(clientAPI).then(isServiceOrder => {
                    return ComLib.getAppParam(clientAPI, 'DOCUMENT', isServiceOrder ? DocLib.ParentObjectType.ServiceOrder : DocLib.ParentObjectType.WorkOrder);
                });
            case DocLib.ParentObjectType.Notification:
                return NotifLib.isServiceNotification(clientAPI).then(isServiceNotification => {
                    return ComLib.getAppParam(clientAPI, 'DOCUMENT', isServiceNotification ? DocLib.ParentObjectType.ServiceNotification : DocLib.ParentObjectType.Notification);
                });
            case DocLib.ParentObjectType.S4ServiceItem:
            case DocLib.ParentObjectType.S4ServiceConfirmationItem:
                {
                    if (ComLib.isDefined(clientAPI.binding)) {
                        return clientAPI.binding.ItemObjectType;
                    }
                    return '';
                }
            case DocLib.ParentObjectType.S4ServiceOrder:
                return S4ServiceLibrary.getServiceOrderObjectType(clientAPI);
            case DocLib.ParentObjectType.S4ServiceConfirmation:
                return S4ServiceLibrary.getServiceConfirmationObjectType(clientAPI);
            case DocLib.ParentObjectType.S4ServiceRequest:
                return S4ServiceLibrary.getServiceRequestObjectType(clientAPI);
            default:
                return ComLib.getAppParam(clientAPI, 'DOCUMENT', DocLib.getParentObjectType(clientAPI));
        }
    }

    /**
     * retrieves the classtype to be used when documents are created
     *
     * @static
     * @param {ClientAPI} clientAPI
     * @return {string} the class type or empty string if not found
     *
     * @memberof DocumentEventLibrary
     */
    static getBDSClassType(clientAPI) {
        let value = ComLib.getAppParam(clientAPI, 'BDSDOCUMENT', 'ClassType');
        if (value) {
            return value;
        }
        return '';
    }

    static get ParentObjectType() {
        return {
            WorkOrder: 'WorkOrder',
            ServiceOrder: 'ServiceOrder',
            Notification: 'Notification',
            ServiceNotification: 'ServiceNotification',
            Equipment: 'Equipment',
            FunctionalLocation: 'FunctionalLocation',
            Operation: 'WorkOrderOperation',
            SubOperation: 'SubOperation',
            WCMDocumentHeader:'WCMDocumentHeader',
            WCMApproval: 'WCMApproval',
            WCMApplication: 'WCMApplication',
            WCMDocumentItem:'WCMDocumentItem',
            InspectionLot:'InspectionLot',
            S4ServiceOrder: 'S4ServiceOrder',
            S4ServiceRequest: 'S4ServiceRequest',
            S4ServiceItem: 'S4ServiceItem',
            S4ServiceConfirmation: 'S4ServiceConfirmation',
            S4ServiceConfirmationItem: 'S4ServiceConfirmationItem',
        };
    }
     /**
     * retrieves the Document Entity Set and query option based on the cell
     *
     * @static
     * @param {ClientAPI} controlProxy
     * @return {Dictionary} dictionary with key entity sey and query option
     *
     */
    static getDocumentObjectDetail(controlProxy) {
        let documentObjectDetail = [];
        let id = '';
        let operation_num = '';

        if (!ValidationLibrary.evalIsEmpty(controlProxy.getPageProxy().binding)) {
            switch (DocLib.lookupParentObjectType(controlProxy, controlProxy.getPageProxy().binding['@odata.type'])) {
                case DocLib.ParentObjectType.WorkOrder:
                    id = controlProxy.getPageProxy().binding.OrderId;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=OrderId eq '" + id + "' and (OperationNo eq '' or OperationNo eq null) and " + this.getDocumentFilter(),
                        'entitySet': 'MyWorkOrderDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.Notification:
                    id = controlProxy.getPageProxy().binding.NotificationNumber;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=NotificationNumber eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'MyNotifDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.Equipment:
                    id = controlProxy.getPageProxy().binding.EquipId;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=EquipId eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'MyEquipDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.FunctionalLocation:
                    id = controlProxy.getPageProxy().binding.FuncLocIdIntern;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=FuncLocIdIntern eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'MyFuncLocDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.Operation:
                    id = controlProxy.getPageProxy().binding.OrderId;
                    operation_num = controlProxy.getPageProxy().binding.OperationNo;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=OrderId eq '" + id + "' and OperationNo eq '" + operation_num + "' and " + this.getDocumentFilter(),
                        'entitySet': 'MyWorkOrderDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.SubOperation:
                    id = controlProxy.getPageProxy().binding.SubOperationNo;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=SubOperationNo eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'MyWorkOrderDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.InspectionLot:
                    id = controlProxy.getPageProxy().binding.InspectionLot;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=InspectionLot eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'InspectionLotDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.S4ServiceItem:
                    id = controlProxy.getPageProxy().binding.ObjectID;
                    operation_num = controlProxy.getPageProxy().binding.ItemNo;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=ObjectID eq '" + id + "' and ItemNo eq '" + operation_num + "'",
                        'entitySet': 'S4ServiceOrderDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.S4ServiceOrder:
                    id = controlProxy.getPageProxy().binding.ObjectID;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=HeaderID eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'S4ServiceOrderDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.S4ServiceConfirmation:
                    id = controlProxy.getPageProxy().binding.ObjectID;
                    documentObjectDetail.push({
                        'queryOption': "$filter=ObjectID eq '" + id + "'",
                        'entitySet': 'S4ServiceConfirmationDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.S4ServiceConfirmationItem:
                    id = controlProxy.getPageProxy().binding.ObjectID;
                    documentObjectDetail.push({
                        'queryOption': "$filter=ObjectID eq '" + id + "' and ItemNo eq '" +  controlProxy.getPageProxy().binding.ItemNo + "'",
                        'entitySet': 'S4ServiceConfirmationDocuments',
                    });
                    break;
                case DocLib.ParentObjectType.S4ServiceRequest:
                    id = controlProxy.getPageProxy().binding.ObjectID;
                    documentObjectDetail.push({
                        'queryOption': "$expand=Document&$filter=HeaderID eq '" + id + "' and " + this.getDocumentFilter(),
                        'entitySet': 'S4ServiceRequestDocuments',
                    });
                    break;
                default:
                    break;
            }
        }
        return documentObjectDetail;
    }

    /**
     * For a given document, this returns the base64String
     *
     * @static
     * @param {ClientAPI} context
     * @param {documentObject} Document
     * @return {String}
     *
     */
    static getBase64String(context, documentObject) {
        let base64String = '';
        let documentPath = DocumentPath(context, documentObject);
        let documentFile = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.File.fromPath(documentPath);

        let binarySource = documentFile.readSync(error => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(),'Error getting binary source: ' + error);
        });

        if (binarySource) {
            base64String = Base64Library.transformBinaryToBase64(IsAndroid(context), binarySource);
        }

        return base64String;
    }

    /**
     * read all the attachments
     *
     * @static
     * @param {context} context
     * @param {objectDetails} object details like entity set and the query options
     * @return {array} array of attachments
     *
     */
    static readAttachments(context, objectDetails) {
        if (ComLib.IsOnCreate(context)) {
            return [];
        }
        let serviceName = '/SAPAssetManager/Services/AssetManager.service';
        let promises = [];
        let attachmentData = [];
        if (objectDetails.length) {
            return context.read(serviceName, objectDetails[0].entitySet, [], objectDetails[0].queryOption).then(attachments => {
                attachments.forEach(attachmentObject => {
                    let documentObject = attachmentObject.Document;
                    if (documentObject) {
                        let readLink = documentObject['@odata.readLink'];
                        let entitySet = readLink.split('(')[0];
                        promises.push(context.isMediaLocal(serviceName, entitySet, readLink).then((isMediaLocal) => {
                            return [isMediaLocal, documentObject];
                        }));
                    }
                });

                return Promise.all(promises).then(results => {
                    results.forEach((result) => {
                        const isMedialLocal = result[0];
                        const attachment = result[1];
                        if (isMedialLocal && !attachment.FileSize) {
                            const entitySet = 'Documents';
                            const property = 'Document';
                            const readLink = attachment['@odata.readLink'];
                            const service = '/SAPAssetManager/Services/AssetManager.service';
                            const documentPath = DocumentPath(context, attachment);
                            let attachmentEntry = context.createAttachmentEntry(documentPath, entitySet, property, readLink, service);
                            if (attachmentEntry) {
                                attachmentData.push(attachmentEntry);
                            }
                        }
                    });

                    return attachmentData;
                });
            });
        } else {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), 'Cannot find parent object type');
        }
        return [];
    }

    static getDocumentFilter() {
        return "sap.entityexists(Document) and (Document/FileName ne '' or Document/FileName ne null)";
    }
}

import libCommon from '../Library/CommonLibrary';
import documentCreate from '../../Documents/Create/DocumentCreateBDS';
import resetFlags from './ResetFlags';
import Logger from '../../Log/Logger';
import libVal from '../../Common/Library/ValidationLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import CreateEntitySuccessMessageNoClosePageWithAutoSave from '../../ApplicationEvents/AutoSync/actions/CreateEntitySuccessMessageNoClosePageWithAutoSave';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import libS4 from '../../ServiceOrders/S4ServiceLibrary';

/**
 * After changeset success, reset the state variables
 */
export default function ChangeSetOnSuccess(pageProxy) {

    if (pageProxy.currentPage.id === 'SubOperationsListViewPage') {
        pageProxy.executeAction('/SAPAssetManager/Rules/WorkOrders/SubOperations/CreateUpdate/WorkOrderSubOperationListViewCaption.js');
    }

    if (pageProxy.currentPage.id === 'WorkOrderOperationsListViewPage') {
        pageProxy.executeAction('/SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationListViewSetCaption.js');
    }

    let geometryObjectType = libCommon.getStateVariable(pageProxy, 'GeometryObjectType');

    if ((libCommon.getStateVariable(pageProxy, 'attachmentCount') > 0) || (libCommon.getStateVariable(pageProxy, 'operationAttachmentCount') > 0)) {
        return documentsCreateOnChangeSetSuccess(pageProxy).then(() => {
            resetFlags(pageProxy);
            libCommon.setStateVariable(pageProxy, 'ObjectCreatedName', 'Document');
            if (geometryObjectType === 'Notification') {
                libCommon.setStateVariable(pageProxy, 'GeometryObjectType', '');
                pageProxy.currentPage.notifBinding = libCommon.getStateVariable(pageProxy, 'CreateNotification');
                return pageProxy.getDefinitionValue('/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateGeometryPre.js');
            } else if (geometryObjectType === 'WorkOrder') {
                libCommon.setStateVariable(pageProxy, 'GeometryObjectType', '');
                pageProxy.currentPage.woBinding = libCommon.getStateVariable(pageProxy, 'CreateWorkOrder');
                return pageProxy.getDefinitionValue('/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateUpdateGeometryPre.js');
            } else if (geometryObjectType === 'FunctionalLocation') {
                libCommon.setStateVariable(pageProxy, 'GeometryObjectType', '');
                pageProxy.currentPage.funcLocBinding = libCommon.getStateVariable(pageProxy, 'CreateFunctionalLocation');
                return pageProxy.getDefinitionValue('/SAPAssetManager/Rules/FunctionalLocation/CreateUpdate/FunctionalLocationCreateUpdateGeometryPre.js');
            } else if (geometryObjectType === 'Equipment') {
                libCommon.setStateVariable(pageProxy, 'GeometryObjectType', '');
                pageProxy.currentPage.equipBinding = libCommon.getStateVariable(pageProxy, 'CreateEquipment');
                return pageProxy.getDefinitionValue('/SAPAssetManager/Rules/Equipment/CreateUpdate/EquipmentCreateUpdateGeometryPre.js');
            }
            return CreateEntitySuccessMessageNoClosePageWithAutoSave(pageProxy);
        }).catch((error) => {
            resetFlags(pageProxy);
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), error);
        });
    } else {
        resetFlags(pageProxy);
        if (!libVal.evalIsEmpty(libCommon.getStateVariable(pageProxy, 'PartAdd'))) {
            libCommon.clearFromClientData(pageProxy, 'PartAdd', false);
            return ExecuteActionWithAutoSync(pageProxy, '/SAPAssetManager/Actions/Toast/ToastMessageCreate.action');
        } else if (!libVal.evalIsEmpty(libCommon.getStateVariable(pageProxy, 'BOMPartAdd'))) {
            libCommon.clearFromClientData(pageProxy, 'BOMPartAdd', false);
            return ExecuteActionWithAutoSync(pageProxy, '/SAPAssetManager/Actions/Toast/ToastMessageCreate.action');
        } else {
            if (geometryObjectType === 'Notification') {
                libCommon.setStateVariable(pageProxy, 'GeometryObjectType', '');
                pageProxy.currentPage.notifBinding = libCommon.getStateVariable(pageProxy, 'CreateNotification');
                return pageProxy.getDefinitionValue('/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateUpdateGeometryPre.js');
            } else if (geometryObjectType === 'WorkOrder') {
                libCommon.setStateVariable(pageProxy, 'GeometryObjectType', '');
                pageProxy.currentPage.woBinding = libCommon.getStateVariable(pageProxy, 'CreateWorkOrder');
                return pageProxy.getDefinitionValue('/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateUpdateGeometryPre.js');
            } else if (geometryObjectType === 'FunctionalLocation') {
                libCommon.setStateVariable(pageProxy, 'GeometryObjectType', '');
                pageProxy.currentPage.funcLocBinding = libCommon.getStateVariable(pageProxy, 'CreateFunctionalLocation');
                return pageProxy.getDefinitionValue('/SAPAssetManager/Rules/FunctionalLocation/CreateUpdate/FunctionalLocationCreateUpdateGeometryPre.js');
            } else if (geometryObjectType === 'Equipment') {
                libCommon.setStateVariable(pageProxy, 'GeometryObjectType', '');
                pageProxy.currentPage.equipBinding = libCommon.getStateVariable(pageProxy, 'CreateEquipment');
                return pageProxy.getDefinitionValue('/SAPAssetManager/Rules/Equipment/CreateUpdate/EquipmentCreateUpdateGeometryPre.js');
            }

            if (IsCompleteAction(pageProxy)) {
                return Promise.resolve();
            }

            return CreateEntitySuccessMessageNoClosePageWithAutoSave(pageProxy);
        }
    }
}

function documentsCreateOnChangeSetSuccess(pageProxy) {
    const isOnSOChangeset = libS4.isOnSOChangeset(pageProxy);
    const isOnSRChangeset = libS4.isOnSRChangeset(pageProxy);

    //WO doc creation
    if (libCommon.getStateVariable(pageProxy, 'attachmentCount') > 0) {
        return documentCreate(pageProxy, libCommon.getStateVariable(pageProxy, 'Doc')).then(() => {
            if (isOnSOChangeset || isOnSRChangeset) {
                let itemDataPageName;
                if (isOnSOChangeset) {
                  itemDataPageName = 'ServiceOrdersListViewPage';
                }
                if (isOnSRChangeset) {
                  itemDataPageName = 'ServiceRequestsListViewPage';
                }
                //S4 doc creation
                if (libCommon.getStateVariable(pageProxy, 'attachmentCount', itemDataPageName) > 0) {
                    libCommon.setStateVariable(pageProxy, 'DocsDataPageName', itemDataPageName);
                    return documentCreate(pageProxy, libCommon.getStateVariable(pageProxy, 'Doc', itemDataPageName)).then(() => {
                        libCommon.removeStateVariable(pageProxy, 'DocsDataPageName');
                    }).catch(error => {
                        Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), error);
                        libCommon.removeStateVariable(pageProxy, 'DocsDataPageName');
                    });
                }
                return Promise.resolve();
            }
            //Op doc creation
            if (libCommon.getStateVariable(pageProxy, 'operationAttachmentCount') > 0) {
                libCommon.setStateVariable(pageProxy, 'operationDocumentCreate', true);
                return documentCreate(pageProxy, libCommon.getStateVariable(pageProxy, 'operationDoc')).then(() => {
                    libCommon.removeStateVariable(pageProxy, 'operationDocumentCreate');
                }).catch(error => {
                    Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), error);
                    libCommon.removeStateVariable(pageProxy, 'operationDocumentCreate');
                });
            }
            return Promise.resolve();
        });
    //No WO Doc, Instead we have only Op Doc creation
    } else if (libCommon.getStateVariable(pageProxy, 'operationAttachmentCount') > 0) {
        libCommon.setStateVariable(pageProxy, 'operationDocumentCreate', true);
        return documentCreate(pageProxy, libCommon.getStateVariable(pageProxy, 'operationDoc')).then(() => {
            libCommon.removeStateVariable(pageProxy, 'operationDocumentCreate');
        }).catch(error => {
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryDocuments.global').getValue(), error);
            libCommon.removeStateVariable(pageProxy, 'operationDocumentCreate');
        });
    }
    return Promise.resolve();
}

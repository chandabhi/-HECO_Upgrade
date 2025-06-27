import {WorkOrderLibrary as libWo} from '../WorkOrders/WorkOrderLibrary';
import libCom from '../Common/Library/CommonLibrary';
import userFeaturesLib from '../../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';
import Logger from '../../../SAPAssetManager/Rules/Log/Logger';
import WorkOrderChangeStatusOptions from '../../../SAPAssetManager/Rules/WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';
import OperationChangeStatusOptions from '../Operations/MobileStatus/OperationChangeStatusOptions';
import pageToolbar from '../../../SAPAssetManager/Rules/Common/DetailsPageToolbar/DetailsPageToolbarClass';
import libMobile from '../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';

export default function WorkOrderDetailsNav(context) {
    let actionBinding;
    let previousPageProxy;
    let pageProxy;
    //OMNI Check if loading from Omni
    let binding = libCom.getStateVariable(context, 'BINDINGOBJECT');
    if(context.getPageProxy()?.getActionBinding() && binding && binding['@odata.readLink'] != context.getPageProxy().getActionBinding()['@odata.readLink']){
        binding = '';
    }
    if(binding) {
        let proxy = context.getPageProxy();
        context.getPageProxy().setActionBinding(binding);
        //Clear binding variable after use so it doesn't interfere with navigation from other pages
        libCom.clearStateVariable(context,'BINDINGOBJECT');
    }
    //OMNI End
    try {
        if (typeof context.getPageProxy === 'function') {
            actionBinding = context.getPageProxy().getActionBinding();
            previousPageProxy = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');
            pageProxy = context.getPageProxy();
        } else {
            actionBinding = context.getActionBinding();
            previousPageProxy = context.evaluateTargetPathForAPI('#Page:-Previous');
            pageProxy = context;
        }
    } catch (err) {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
            Logger.error('METER' , 'No Previous Page Exists');
            actionBinding = context.getPageProxy().getActionBinding();
            pageProxy = context.getPageProxy();
            let queryOptions = libWo.getWorkOrderDetailsNavQueryOption(context);
            if (queryOptions.indexOf('$expand=') > 0) {
                let expandIndex = queryOptions.indexOf('$expand=');
                let beforeExpand = queryOptions.substring(0, expandIndex);
                let afterExpand = queryOptions.substring(expandIndex + 8);
                queryOptions = beforeExpand + '$expand=Operations/OperationMobileStatus_Nav,Operations/WOHeader,OrderISULinks/ConnectionObject_Nav/Premises_Nav,OrderISULinks/Installation_Nav,OrderISULinks/Premise_Nav,OrderISULinks/Device_Nav/RegisterGroup_Nav/Division_Nav,OrderISULinks/DeviceCategory_Nav/Material_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav,DisconnectActivity_Nav/DisconnectActivityType_Nav,DisconnectActivity_Nav/DisconnectActivityStatus_Nav,' + afterExpand;
            } else {
                queryOptions = queryOptions + 'OrderISULinks/ConnectionObject_Nav/Premises_Nav,OrderISULinks/Installation_Nav,OrderISULinks/Premise_Nav,OrderISULinks/Device_Nav/RegisterGroup_Nav/Division_Nav,OrderISULinks/DeviceCategory_Nav/Material_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav,DisconnectActivity_Nav/DisconnectActivityType_Nav,DisconnectActivity_Nav/DisconnectActivityStatus_Nav,';
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], queryOptions).then(function(result) {
                pageProxy.setActionBinding(result.getItem(0));
                return generateToolbarItems(pageProxy).then(() => {
                    let newBinding = result.getItem(0);
                    if (newBinding.OrderISULinks[0]) {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action');
                    }
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action');
                });
            });
        } else {
            actionBinding = context.getPageProxy().getActionBinding();
            pageProxy = context.getPageProxy();
            return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], libWo.getWorkOrderDetailsNavQueryOption(context)).then(function(result) {
                pageProxy.setActionBinding(result.getItem(0));
                return generateToolbarItems(pageProxy).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action');
                });
            });
        }
    }

    if (libCom.getPageName(previousPageProxy) === 'PartDetailsPage') {
        let partsPreviousPage = previousPageProxy.evaluateTargetPathForAPI('#Page:-Previous');
        if (libCom.getPageName(partsPreviousPage) === 'PartsListViewPage') {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                });
            });
        }
    }

    if (libCom.getPageName(previousPageProxy) === 'WorkOrderDetailsPage' && previousPageProxy.getBindingObject().OrderId === actionBinding.OrderId) { //if the previous page was the parent workorder then, navigate back
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }

    if (libCom.getPageName(previousPageProxy) === 'InspectionLotDetailsPage') {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        });
    } 

    if (libCom.getPageName(previousPageProxy) === 'ObjectDetailsViewPage') {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
        });
    }

    let queryOptions = libWo.getWorkOrderDetailsNavQueryOption(context);
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        if (queryOptions.indexOf('$expand=') > 0) {
            let expandIndex = queryOptions.indexOf('$expand=');
            let beforeExpand = queryOptions.substring(0, expandIndex);
            let afterExpand = queryOptions.substring(expandIndex + 8);
            queryOptions = beforeExpand + '$expand=OrderISULinks/ConnectionObject_Nav/Premises_Nav,OrderISULinks/Installation_Nav,OrderISULinks/Premise_Nav,OrderISULinks/Device_Nav/RegisterGroup_Nav/Division_Nav,OrderISULinks/DeviceCategory_Nav/Material_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav,DisconnectActivity_Nav/DisconnectActivityType_Nav,DisconnectActivity_Nav/DisconnectActivityStatus_Nav,' + afterExpand;
        } else {
            queryOptions = queryOptions + 'OrderISULinks/ConnectionObject_Nav/Premises_Nav,OrderISULinks/Installation_Nav,OrderISULinks/Premise_Nav,OrderISULinks/Device_Nav/RegisterGroup_Nav/Division_Nav,OrderISULinks/DeviceCategory_Nav/Material_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav,DisconnectActivity_Nav/DisconnectActivityType_Nav,DisconnectActivity_Nav/DisconnectActivityStatus_Nav,';
        }
    }
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], queryOptions).then(function(result) {
        pageProxy.setActionBinding(result.getItem(0));
        return generateToolbarItems(pageProxy).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action');
        });
    });
}

async function generateToolbarItems(pageProxy) {
    if (libMobile.isHeaderStatusChangeable(pageProxy)) {
        let bindingOriginal = pageProxy.binding;
        pageProxy._context.binding = pageProxy.getActionBinding(); // replace binding with action binding so that we can use WorkOrderChangeStatusOptions before we navigated to the page
        return WorkOrderChangeStatusOptions(pageProxy).then(items => {
            pageProxy._context.binding = bindingOriginal; // revert to original binding 
            return pageToolbar.getInstance().generatePossibleToolbarItems(pageProxy, items, 'WorkOrderDetailsPage').then(() => {
                return Promise.resolve();
            });
        });
    } else {
        let bindingOriginal = pageProxy.binding;
        let { Operations } = pageProxy.getActionBinding();
        if ((Operations && Operations.length === 0) || !Operations) {
            return Promise.resolve();
        }
        let operationBinding = await pageProxy.read("/SAPAssetManager/Services/AssetManager.service", Operations[0]['@odata.readLink'], [], "$expand=OperationMobileStatus_Nav,WOHeader");
        pageProxy._context.binding = operationBinding._array[0]; // replace binding with action binding so that we can use WorkOrderChangeStatusOptions before we navigated to the page

        return OperationChangeStatusOptions(pageProxy, true).then(async items => {
            pageProxy._context.binding = bindingOriginal; // revert to original binding 
            return pageToolbar.getInstance().generatePossibleToolbarItems(pageProxy, items, 'WorkOrderDetailsPage').then(() => {
                return Promise.resolve();
            });
        }).catch(error => {
            pageProxy._context.binding = bindingOriginal;
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), error);
            return Promise.resolve();
        });
    }
}


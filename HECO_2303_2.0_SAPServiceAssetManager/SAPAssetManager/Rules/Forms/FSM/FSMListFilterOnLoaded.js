import libCom from '../../Common/Library/CommonLibrary';
import filterOnLoaded from '../../Filter/FilterOnLoaded';
import InspectionLotLibrary from '../../WorkOrders/InspectionLot/InspectionLotLibrary';


export default function FSMListFilterOnLoaded(context) {
    filterOnLoaded(context); //Run the default filter on loaded

    let clientData = context.evaluateTargetPath('#Page:FSMSmartFormsInstancesListViewPage/#ClientData');
    let operationFilter = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:OperationFilter');

    if (clientData && clientData.workOrderFilter !== undefined) {
        let workOrderSelection = clientData.workOrderFilter;
        let workOrderFilter = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:WorkOrderFilter');
        workOrderFilter.setValue(workOrderSelection);

        libCom.setFormcellEditable(operationFilter);
        let entity = "MyWorkOrderHeaders('" + workOrderSelection + "')/Operations";
        let filter = '$orderby=OperationNo&$filter=sap.entityexists(FSMFormInstance_Nav)';
        let pageProxy = context.getPageProxy();
        let opListPickerProxy = libCom.getControlProxy(pageProxy, 'OperationFilter');
        return InspectionLotLibrary.setOperationSpecifier(opListPickerProxy, entity, filter).then(() => {
            if (libCom.isDefined(clientData.operationFilter)) {
                operationFilter.setValue(clientData.operationFilter);
            }
            return Promise.resolve(true);
        });
    } else {
        if (context.binding && context.binding.OrderId) {
            let entity = "MyWorkOrderHeaders('" + context.binding.OrderId + "')/Operations";
            let filter = '$orderby=OperationNo&$filter=sap.entityexists(FSMFormInstance_Nav)';
            let pageProxy = context.getPageProxy();
            let opListPickerProxy = libCom.getControlProxy(pageProxy, 'OperationFilter');
            return InspectionLotLibrary.setOperationSpecifier(opListPickerProxy, entity, filter).then(() => {
                if (clientData.operationFilter !== undefined) {
                    operationFilter.setValue(clientData.operationFilter);
                }
                return Promise.resolve(true);
            });
        } else {
            libCom.setFormcellNonEditable(operationFilter);
        }
    }
}

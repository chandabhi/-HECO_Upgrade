export default function FunctionalLocationQueryOptions(context) {
    let binding = context.getPageProxy().binding;
    let searchString = context.searchString;
    
    if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        let filter = `(WorkOrderHeader/any( wo: wo/OrderId eq '${binding.OrderId}' ) or WorkOrderOperation/any(wo: wo/OrderId eq '${binding.OrderId}' ) or WorkOrderSubOperation/any( wo: wo/OrderId eq '${binding.OrderId}'))`;
        if (searchString) {
            let qob = context.dataQueryBuilder();
            qob.expand('WorkOrderHeader,WorkCenter_Main_Nav,MeasuringPoints,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav').select('*,WorkCenter_Main_Nav/*,MeasuringPoints/Point');
            let filters = [
                `substringof('${searchString.toLowerCase()}', tolower(FuncLocDesc))`,
                `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/PlantId))`,
                `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/WorkCenterDescr))`,
                `substringof('${searchString.toLowerCase()}', tolower(FuncLocId))`,
                `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/WorkCenterName))`,
                `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/ExternalWorkCenterId))`,
            ]; 
            qob.filter(`${filter} and (${filters.join(' or ')})`);
            return qob;
        }
        return `$expand=WorkOrderHeader,WorkCenter_Main_Nav,MeasuringPoints,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav&$select=*,WorkCenter_Main_Nav/*,MeasuringPoints/Point&$filter=${filter}`;
    }

    if (binding && binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        let filter = `(S4RefObject_Nav/any(so: so/ObjectID eq '${binding.ObjectID}' ))`;
        if (searchString) {
            let qob = context.dataQueryBuilder();
            qob.expand('S4RefObject_Nav/S4ServiceOrder_Nav');
            let filters = [
                `substringof('${searchString.toLowerCase()}', tolower(FuncLocDesc))`,
                `substringof('${searchString.toLowerCase()}', tolower(FuncLocId))`,
            ]; 
            qob.filter(`${filter} and (${filters.join(' or ')})`);
            return qob;
        }
        return `$expand=S4RefObject_Nav/S4ServiceOrder_Nav&$filter=${filter}`;
    }

    if (binding && binding['@odata.type'] === '#sap_mobile.S4ServiceRequest') {
        let filter = `(S4RequestRefObj_Nav/any(so: so/ObjectID eq '${binding.ObjectID}' ))`;
        if (searchString) {
            let qob = context.dataQueryBuilder();
            qob.expand('S4RequestRefObj_Nav/S4ServiceRequest_Nav');
            let filters = [
                `substringof('${searchString.toLowerCase()}', tolower(FuncLocDesc))`,
                `substringof('${searchString.toLowerCase()}', tolower(FuncLocId))`,
            ]; 
            qob.filter(`${filter} and (${filters.join(' or ')})`);
            return qob;
        }
        return `$expand=S4RequestRefObj_Nav/S4ServiceRequest_Nav&$filter=${filter}`;
    }

    if (binding && binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmation') {
        let filter = `(S4ServiceConfirmationRefObj_Nav/any(so: so/ObjectID eq '${binding.ObjectID}' ))`;
        if (searchString) {
            let qob = context.dataQueryBuilder();
            qob.expand('S4ServiceConfirmationRefObj_Nav/S4ServiceConfirmation_Nav');
            let filters = [
                `substringof('${searchString.toLowerCase()}', tolower(FuncLocDesc))`,
                `substringof('${searchString.toLowerCase()}', tolower(FuncLocId))`,
            ]; 
            qob.filter(`${filter} and (${filters.join(' or ')})`);
            return qob;
        }
        return `$expand=S4ServiceConfirmationRefObj_Nav/S4ServiceConfirmation_Nav&$filter=${filter}`;
    }

    if (searchString) {
        let qob = context.dataQueryBuilder();
        qob.expand('SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav,WorkCenter_Main_Nav,MeasuringPoints,FuncLocDocuments').select('*,WorkCenter_Main_Nav/*,MeasuringPoints/Point').orderBy('FuncLocId');
        let filters = [
            `substringof('${searchString.toLowerCase()}', tolower(FuncLocDesc))`,
            `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/PlantId))`,
            `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/WorkCenterDescr))`,
            `substringof('${searchString.toLowerCase()}', tolower(FuncLocId))`,
            `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/WorkCenterName))`,
            `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/ExternalWorkCenterId))`,
        ];
        qob.filter(`(${filters.join(' or ')})`);
        return qob;
    } else {
        return '$expand=ObjectStatus_Nav/SystemStatus_Nav,WorkCenter_Main_Nav,MeasuringPoints,FuncLocDocuments,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav&$select=*,ObjectStatus_Nav/SystemStatus_Nav/StatusText,WorkCenter_Main_Nav/*,MeasuringPoints/Point';
    }
}

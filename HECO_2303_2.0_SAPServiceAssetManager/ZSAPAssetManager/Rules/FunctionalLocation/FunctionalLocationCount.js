import CommonLibrary from '../Common/Library/CommonLibrary';
import FunctionalLocationQueryOptions from './FunctionalLocationQueryOptions';

export default function FunctionalLocationCount(context) {
    if (CommonLibrary.isDefined(context.getPageProxy().binding) && CommonLibrary.isDefined(context.getPageProxy().binding['@odata.type'])) {
            if (context.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                return CommonLibrary.getEntitySetCount(context, 'MyFunctionalLocations', `$filter=WorkOrderHeader/any( wo: wo/OrderId eq '${context.getPageProxy().binding.OrderId}' ) or WorkOrderOperation/any(wo: wo/OrderId eq '${context.getPageProxy().binding.OrderId}' ) or WorkOrderSubOperation/any( wo: wo/OrderId eq '${context.getPageProxy().binding.OrderId}' )`).then(count => {
                    if (count) {
                        context.getPageProxy().getClientData().Count= count;
                        return count;
                    } else {
                        context.getPageProxy().getClientData().Count= 0;
                        return 0;
                    }
                });
            }

            if (context.getPageProxy().binding['@odata.type'] === '#sap_mobile.S4ServiceOrder' || context.getPageProxy().binding['@odata.type'] === '#sap_mobile.S4ServiceRequest') { 
                let countFromBinding = context.binding ? context.binding.length : 0;

                if (countFromBinding === undefined) {
                    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', FunctionalLocationQueryOptions(context)).then((count) => {
                        context.getPageProxy().getClientData().Count = count;
                        return count;
                    });  
                }

                return Promise.resolve(countFromBinding);
            }

            return 0;
    } else {
        return CommonLibrary.getEntitySetCount(context, 'MyFunctionalLocations', '').then(count => {
            if (count) {
                context.getPageProxy().getClientData().Count= count;
                return count;
            } else {
                context.getPageProxy().getClientData().Count= 0;
                return 0;
            }
        });
    }
}

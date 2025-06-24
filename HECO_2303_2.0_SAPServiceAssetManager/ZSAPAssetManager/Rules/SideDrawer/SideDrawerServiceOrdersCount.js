import IsS4SidePanelEnabled from './IsS4SidePanelEnabled';
import workorderCount from '../WorkOrders/WorkOrdersCount';
import getFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';

export default function SideDrawerWorkOrdersCount(context) {
    if (IsS4SidePanelEnabled(context)) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders')
            .then(count => {
                return context.localizeText('service_order_x', [count]);
            })
            .catch(() => {
                return context.localizeText('service_order_x', [0]);
            });
    } else {
        return getFSMQueryOption(context).then(queryOptions => {
            return workorderCount(context, '$filter=' + queryOptions).then(result => {
                return context.localizeText('service_order_x', [result]);
            });
        });
    }
}

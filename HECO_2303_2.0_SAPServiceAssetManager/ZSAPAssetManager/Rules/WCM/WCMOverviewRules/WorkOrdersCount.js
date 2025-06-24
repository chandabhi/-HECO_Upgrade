import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';

export default function WorkOrdersCount(context) {
    return libCom.getEntitySetCount(context, 'MyWorkOrderHeaders', `$filter=${libWO.getWCMWorkOrdersFilter()}`).then(count => {
        return count;
    });
}

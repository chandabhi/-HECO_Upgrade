import libSubOpMobile from '../../SubOperations/MobileStatus/SubOperationMobileStatusLibrary';
import WorkOrderSubOperationListViewCaption from './CreateUpdate/WorkOrderSubOperationListViewCaption';

export default function SubOperationListViewOnReturning(context) {
    return libSubOpMobile.isAnySubOperationStarted(context).then(() => {
        return WorkOrderSubOperationListViewCaption(context);
    });
}

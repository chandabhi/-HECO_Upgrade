import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import WorkOrderOperationsFSMQueryOption from './WorkOrderOperationsFSMQueryOption';
import WorkOrderOperationsListViewQueryOption from './WorkOrderOperationsListViewQueryOption';
import { OperationConstants } from './WorkOrderOperationLibrary';

export default function WorkOrderOperationsListViewQueryOptionWrapper(context) {
    if (PersonaLibrary.isFieldServiceTechnician(context)) {
        return WorkOrderOperationsFSMQueryOption(context).then(fsmQueryOptions => {
            let queryOptions = WorkOrderOperationsListViewQueryOption(context);
            if (typeof queryOptions === 'string') {
                queryOptions = context.dataQueryBuilder(queryOptions);
            }
            if (!ValidationLibrary.evalIsEmpty(fsmQueryOptions)) {
                queryOptions.filter(fsmQueryOptions);
            }
            return queryOptions;
        });
    } else {
        let queryOptions = WorkOrderOperationsListViewQueryOption(context);
        if (typeof queryOptions === 'string') {
            queryOptions = context.dataQueryBuilder(queryOptions);
        }

        if (PersonaLibrary.isWCMOperator(context)) {
            const filterWCM = OperationConstants.WCMOperationsFilter();
            if (queryOptions.hasFilter) {
                queryOptions.filter().and(filterWCM);
            } else {
                queryOptions.filter(filterWCM);
            }
        }

        return queryOptions;
    }
}

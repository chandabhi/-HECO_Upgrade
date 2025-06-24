import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from './WorkOrdersFSMQueryOption';
import WorkOrdersListViewQueryOption from './WorkOrdersListViewQueryOption';
import { WorkOrderLibrary } from '../WorkOrderLibrary';

export default function WorkOrdersListViewQueryOptionWrapper(clientAPI) {
    if (PersonaLibrary.isFieldServiceTechnician(clientAPI)) {
        return WorkOrdersFSMQueryOption(clientAPI).then(fsmQueryOptions => {
            let queryOptions = WorkOrdersListViewQueryOption(clientAPI);
            if (!ValidationLibrary.evalIsEmpty(fsmQueryOptions)) {
                queryOptions.filter(fsmQueryOptions);
            }
            return queryOptions;
        });
    } else {
        const queryBuilder = WorkOrdersListViewQueryOption(clientAPI);
        if (PersonaLibrary.isWCMOperator(clientAPI)) {
            const filterWCM = WorkOrderLibrary.getWCMWorkOrdersFilter();
            if (queryBuilder.hasFilter) {
                queryBuilder.filter().and(filterWCM);
            } else {
                queryBuilder.filter(filterWCM);
            }
        }
        return queryBuilder;
    }
}

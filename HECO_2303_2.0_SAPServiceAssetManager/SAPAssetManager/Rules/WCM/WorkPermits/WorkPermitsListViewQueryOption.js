import CommonLibrary from '../../Common/Library/CommonLibrary';
import { GetSectionedTableFilterTerm } from '../Common/DataQueryBuilderUtils';
import { GetSearchStringFilterTerm, ListPageQueryOptionsHelper } from '../Common/ListPageQueryOptionsHelper';
import RelatedWorkPermitsReadLink from './RelatedWorkPermitsReadLink';


export default function WorkPermitsListViewQueryOption(context) {
    const pageName = CommonLibrary.getPageName(context);
    const toExpand = ['WCMApplicationDocuments', 'WCMApplicationUsages'];
    const navigationRelatedFilterTerms = [GetRelatedByDataTypeFilterTerm(context)];

    if (pageName !== 'WorkPermitsListViewPage') {
        const queryBuilder = context.dataQueryBuilder();
        queryBuilder.expand(toExpand);
        if (pageName === 'WCMOverviewPage') {
            queryBuilder.top(4);
        }
        if (pageName === 'WorkOrderDetailsPage' || pageName === 'WorkApprovalDetailsPage') {
            queryBuilder.top(2);
            navigationRelatedFilterTerms.forEach(term => {
                if (term) {
                    if (queryBuilder.hasFilter) {
                        queryBuilder.filter().and(term);
                    } else {
                        queryBuilder.filter(term);
                    }
                }
            });
        }
        return queryBuilder;
    }

    const page = context.evaluateTargetPathForAPI('#Page:WorkPermitsListViewPage');
    const sectionedTableFilterTerm = GetSectionedTableFilterTerm(page.getControl('SectionedTable'));
    const extraFilters = [GetSearchStringFilterTerm(context, context.searchString.toLowerCase(), ['WCMApplication', 'WorkPermitDescr'])];
    return ListPageQueryOptionsHelper(context, page, toExpand, sectionedTableFilterTerm, navigationRelatedFilterTerms, extraFilters, RelatedWorkPermitsReadLink(context), 'wcm_work_permits_x', 'wcm_work_permits_x_x');
}

//filtering for display Related Work Permits
export function GetRelatedByDataTypeFilterTerm(context) {
    const binding = context.binding;
    const dataType = binding && binding['@odata.type'];

    switch (dataType) {
        case '#sap_mobile.WCMDocumentHeader':
            return `WCMApplicationDocuments/any(i:i/WCMDocument eq '${binding.WCMDocument}')`;
        case '#sap_mobile.MyWorkOrderHeader':
            return `WCMApplicationOrders/any(i:i/Order eq '${binding.OrderId}')`;
        case '#sap_mobile.WCMApproval':
            return `WCMApprovalApplications/any(i:i/WCMApproval eq '${binding.WCMApproval}')`;
        default:
            return '';        
    }
}

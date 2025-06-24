import SetOperationalItemsListCaption from './SetOperationalItemsListCaption';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function OperationalItemsListViewQueryOptions(context) {
    const pageName = CommonLibrary.getPageName(context);
    const searchString = context.searchString;
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('WCMDocumentHeaders,WCMOpGroup_Nav,PMMobileStatus,MyFunctionalLocations');

    //Collect filters from filter page and quick filters and update caption on list page
    if (pageName === 'OperationalItemsListViewPage') {
        let filterQueryOptions = '';

        if (context.filters && context.filters.length) {
            const filters = [];
            context.filters.forEach((filter) => {
                //ignore sorting and etc
                if (filter.type !== 1) {
                    return;
                }
                const name = filter.name;
                const groupFilters = [];

                filter.filterItems.forEach((item) => {
                    groupFilters.push(name ? `${name} eq '${item}'` : item);
                });

                if (groupFilters.length) {
                    filters.push(`(${groupFilters.join(' or ')})`);
                }
            });

            filterQueryOptions = filters.length ? `$filter=${filters.join(' and ')}` : '';
        }

        SetOperationalItemsListCaption(context.getPageProxy(), filterQueryOptions);
    }

    if (pageName === 'WCMOverviewPage' || pageName === 'SafetyCertificateDetailsPage') {
        queryBuilder.top(4);
    }

    if (pageName === 'SafetyCertificateDetailsPage' || (pageName === 'OperationalItemsListViewPage' && context.binding)) {
        queryBuilder.orderBy('Sequence');
    }

    if (searchString) {
        const lowerCaseSearchString = searchString.toLowerCase();
        const subStringFilterTerms = ['ShortText', 'Tag', 'MyFunctionalLocations/FuncLocId', 'Equipment'].map(name => `substringof('${lowerCaseSearchString}', tolower(${name}))`);
        queryBuilder.filter().or(...subStringFilterTerms);
    }

    return queryBuilder;
}

import { DQBExpand, DQBFilter } from './DataQueryBuilderUtils';
import libCom from '../../Common/Library/CommonLibrary';


export function ListPageQueryOptionsHelper(context, page, toExpand, sectionedTableFilterTerm, navigationRelatedFilterTerms, extraFilters, readLink, singleCountTitle, multiCountTitle, captionExtraFilters = []) {
    let totalCountDqb, countDqb, toReturnDqb;
    [totalCountDqb, countDqb, toReturnDqb] = [...Array(3)].map(() => context.dataQueryBuilder());

    [totalCountDqb, countDqb, toReturnDqb]
        .map(dqb => DQBExpand(dqb, toExpand))
        .forEach(dqb => DQBFilter(dqb, navigationRelatedFilterTerms));

    DQBFilter(countDqb, [sectionedTableFilterTerm].concat(extraFilters));
    DQBFilter(toReturnDqb, extraFilters);

    if (captionExtraFilters && captionExtraFilters.length) {
        DQBFilter(countDqb, captionExtraFilters);
        DQBFilter(totalCountDqb, captionExtraFilters);
    }

    //Update caption only if page is defined
    return page ? Promise.all([totalCountDqb, countDqb].map(dqb => dqb.build()))
        .then(([totalCountDqbTerms, countDqbTerms]) => {
            return Promise.all([
                libCom.getEntitySetCount(context, readLink, countDqbTerms),
                libCom.getEntitySetCount(context, readLink, totalCountDqbTerms),
            ]).then(([count, totalCount]) => {
                page.setCaption(count === totalCount ? context.localizeText(singleCountTitle, [count]) : context.localizeText(multiCountTitle, [count, totalCount]));
                return toReturnDqb;
            });
        }) : toReturnDqb;
}

export function GetSearchStringFilterTerm(context, searchString, properties) {
    if (searchString) {
        const dqb = context.dataQueryBuilder();
        const filterBuilder = dqb.filterTerm().or(...properties.map(propName => `substringof('${searchString.toLowerCase()}', tolower(${propName}))`));
        return filterBuilder.composeFilterString(filterBuilder);
    }
    return '';
}

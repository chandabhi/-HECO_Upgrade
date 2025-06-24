export default function WorkApprovalsListViewFilters(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Sorter, 'WCMApproval', undefined, ['WCMApproval'], false)];
}

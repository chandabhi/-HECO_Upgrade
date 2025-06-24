
export default function DefaultOrderByPriority(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Sorter, 'Priority', undefined, ['Priority'], false)];
}

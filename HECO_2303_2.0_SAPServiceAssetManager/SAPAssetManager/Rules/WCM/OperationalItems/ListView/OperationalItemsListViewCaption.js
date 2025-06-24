import OperationalItemsCount from '../OperationalItemsCount';

export default function OperationalItemsListViewCaption(context) {
    return OperationalItemsCount(context).then(count => {
        return context.localizeText('operational_items_x', [count]);
    });
}

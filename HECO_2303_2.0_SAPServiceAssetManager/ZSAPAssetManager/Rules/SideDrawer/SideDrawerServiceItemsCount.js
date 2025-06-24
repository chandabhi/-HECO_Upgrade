import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';

export default function SideDrawerServiceItemsCount(context) {
    return S4ServiceLibrary.countAllS4ServiceItems(context)
        .then(count => {
            return context.localizeText('service_order_items_count_x', [count]);
        }).catch(() => {
            return context.localizeText('service_order_items_count_x', [0]);
        });
}

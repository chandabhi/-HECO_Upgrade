import ItemsData from './ItemsData';
import MaterialDocItemEditVisible from './MaterialDocItemEditVisible';

export default function ItemPageOnReturning(context) {
    return MaterialDocItemEditVisible(context).then(flag => {
        context.setActionBarItemVisible(0, flag);
        let item = context.getPageProxy().getClientData().item;
        if (item && item['@odata.id'] !== context.binding['@odata.id']) {
            return ItemsData(context).then(items => {

                for (let i = 0; i < items.length; i++) {
                    const value = items[i];
                    if (value['@odata.id'] === item['@odata.id']) {
                        context.getPageProxy().getClientData().item = value;
                    }
                }
                context.getPageProxy().getControl('SectionedTable').redraw();
            });
        }
        return false;
    });
}

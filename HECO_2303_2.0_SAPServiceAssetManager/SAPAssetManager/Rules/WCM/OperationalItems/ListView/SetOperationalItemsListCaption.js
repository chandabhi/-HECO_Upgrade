import OperationalItemsCount from '../OperationalItemsCount';

export default function SetOperationalItemsListCaption(context, queryOptions = '') {
    const totalCountPromise = OperationalItemsCount(context);
    const filteredCountPromise = OperationalItemsCount(context, queryOptions);

    Promise.all([filteredCountPromise, totalCountPromise]).then((countsArray) => {
        let count = countsArray[0];
        let totalCount = countsArray[1];

        const caption = count === totalCount ? context.localizeText('operational_items_x', [count]) : context.localizeText('operational_items_x_x', [count, totalCount]);
        context.setCaption(caption);
    });
}


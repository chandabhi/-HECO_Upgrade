import ExpensesCount from '../Expenses/ExpensesCount';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';
import IsS4SidePanelEnabled from './IsS4SidePanelEnabled';

export default function SideDrawerExpensesCount(context) {
    if (IsS4SidePanelEnabled(context)) {
        let categories = S4ServiceLibrary.getServiceProductExpenseCategories(context);
        return S4ServiceLibrary.countItemsByCategory(context, categories)
            .then(count => {
                return context.localizeText('expenses', [count]);
            })
            .catch(() => {
                return context.localizeText('expenses', [0]);
            });
    }

    return ExpensesCount(context).then(count => context.localizeText('expenses', [count]));
}

import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetCategoryByProperties from '../../ServiceOrders/Details/GetCategoryByProperties';
import SetUpAttachmentTypes from '../../Documents/SetUpAttachmentTypes';

export default function CreateUpdateServiceItemPageLoaded(context) {
    SetUpAttachmentTypes(context);

    if (CommonLibrary.IsOnCreate(context) && context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        let fieldsToReset = ['DescriptionNote', 'ServiceTypeLstPkr', 'ValuationTypeLstPkr', 'AccountIndicatorLstPkr', 'ProductIdLstPkr',
            'ItemCategoryLstPkr', 'ServiceContractLstPkr', 'Category1LstPkr', 'Category2LstPkr', 'Category3LstPkr', 'Category4LstPkr',
            'TimeUnitLstPkr', 'PlannedDurationSimple', 'QuantitySimple', 'CurrencyLstPkr', 'AmountProperty'];

        fieldsToReset.forEach(filed => {
            CommonLibrary.getControlProxy(context, filed).setValue('');
        });
    }

    CommonLibrary.saveInitialValues(context);

    if (!CommonLibrary.IsOnCreate(context) && context.binding && context.binding.SchemaID && context.binding.CategoryID) {
        return GetCategoryByProperties(context, undefined, context.binding.SchemaID, context.binding.CategoryID).then((category) => {
            if (category.CategoryLevel) {
                let categoryControl;

                switch (category.CategoryLevel.trim()) {
                    case '1':
                        categoryControl = CommonLibrary.getControlProxy(context, 'Category1LstPkr');
                        break;
                    case '2':
                        categoryControl = CommonLibrary.getControlProxy(context, 'Category2LstPkr');
                        break;
                    case '3':
                        categoryControl = CommonLibrary.getControlProxy(context, 'Category3LstPkr');
                        break;
                    case '4':
                        categoryControl = CommonLibrary.getControlProxy(context, 'Category4LstPkr');
                        break;
                    default:
                        break;
                }

                if (categoryControl) {
                    categoryControl.setValue(category.CategoryGuid, true);
                }
            }

            return Promise.resolve();
        });
    }

    return Promise.resolve();
}

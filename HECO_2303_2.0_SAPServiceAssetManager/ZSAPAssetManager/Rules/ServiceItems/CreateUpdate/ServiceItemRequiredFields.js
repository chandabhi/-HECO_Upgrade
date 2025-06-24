import IsFromItemsList from './IsItemCreateFromServiceItemsList';

export default function ServiceItemRequiredFields(context) {
    let requiredFields = [
        'ProductIdLstPkr',
        'ItemCategoryLstPkr',
        'DescriptionNote',
    ];

    if (IsFromItemsList(context)) {
        requiredFields.push('ServiceOrderLstPkr');
    }

    return requiredFields;
}


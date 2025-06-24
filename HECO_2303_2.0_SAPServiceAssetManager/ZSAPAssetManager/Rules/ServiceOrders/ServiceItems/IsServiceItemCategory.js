import S4ServiceLibrary from '../S4ServiceLibrary';

export default function IsServiceItemCategory(context) {
    const serviceItemCategories = S4ServiceLibrary.getServiceProductItemCategories(context);
    return serviceItemCategories.includes(context.binding.ItemObjectType);
}

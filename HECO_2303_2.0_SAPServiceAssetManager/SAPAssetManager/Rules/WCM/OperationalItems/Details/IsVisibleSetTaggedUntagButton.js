import OperationItemToolBarCaption from './OperationItemToolBarCaption';

export default function IsVisibleSetTaggedUntagButton(context) {
    const wcmDocumentItem = context.binding;

    return OperationItemToolBarCaption(context, wcmDocumentItem)
        .then(caption => caption !== '');
}

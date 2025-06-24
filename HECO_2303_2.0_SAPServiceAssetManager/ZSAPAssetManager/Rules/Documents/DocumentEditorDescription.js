import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function DocumentEditorDescription(context) {
    const description = libCom.getStateVariable(context, 'DocumentEditorDescription');
    if (!libVal.evalIsEmpty(description)) {
        return description;
    }
    return context.binding.Document.Description;
}

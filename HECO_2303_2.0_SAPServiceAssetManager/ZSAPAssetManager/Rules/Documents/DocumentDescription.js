import {ValueIfExists} from '../Common/Library/Formatter';

export default function DocumentDescription(context) {
    let binding = context.getBindingObject();
    let description = ValueIfExists(binding.Document.Description);
    if(binding.Document.ZDocumentIsSensitive && binding.Document.ZDocumentIsSensitive == 'X') {
        description = description + '  SENSITIVE'
    }
    return description;
}

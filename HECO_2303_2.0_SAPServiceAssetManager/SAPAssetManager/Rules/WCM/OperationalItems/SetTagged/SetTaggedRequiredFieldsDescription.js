import SetTaggedRequiredFields from './SetTaggedRequiredFields';
import { TagStates } from '../Details/OperationItemToolBarCaption';

export default function SetTaggedRequiredFieldsDescription(context) {
    return context.binding.taggingState === TagStates.SetTagged && SetTaggedRequiredFields(context).length ? context.localizeText('required_fields') : '';
}

import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ApprovalNotesValue(context) {
    return ValueIfExists(context.binding.WCMApprovalProcessLongtexts, undefined, (longText) => longText.TextString);
}

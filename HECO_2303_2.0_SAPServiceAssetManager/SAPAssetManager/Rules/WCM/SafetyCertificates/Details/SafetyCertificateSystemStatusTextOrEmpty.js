import { GetSystemStatusText } from '../../Common/SystemStatusText';

export default function SafetyCertificateSystemStatusTextOrEmpty(context) {
    return GetSystemStatusText(context, context.binding.ActualSystemStatus).then(systemStatusText => systemStatusText ? systemStatusText : '');
}

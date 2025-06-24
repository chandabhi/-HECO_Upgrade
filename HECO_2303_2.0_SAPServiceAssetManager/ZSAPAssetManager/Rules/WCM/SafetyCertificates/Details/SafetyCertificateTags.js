import SafetyCertificateSystemStatusTextOrEmpty from './SafetyCertificateSystemStatusTextOrEmpty';
import SafetyCertificateUsageDescriptionOrEmpty from './SafetyCertificateUsageDescriptionOrEmpty';

export default function SafetyCertificateTags(context) {
    return Promise.all([
        SafetyCertificateSystemStatusTextOrEmpty(context),
        SafetyCertificateUsageDescriptionOrEmpty(context),
    ]).then(possibleEmptyTags => possibleEmptyTags.filter(stringOrEmpty => !!stringOrEmpty));
}

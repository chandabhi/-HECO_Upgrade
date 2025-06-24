import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function SafetyCertificatesListViewFilters(context) {
    return SafetyCertificatesLibrary.getCertificatesFilters(context);
}

import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function LOTOCertificatesListViewQueryOption(context) {
    return SafetyCertificatesLibrary.getCertificatesListQueryOptions(context, SafetyCertificatesLibrary.typeLOTO);
}

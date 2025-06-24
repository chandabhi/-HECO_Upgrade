import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function LOTOCertificatesOverviewPageQueryOption() {
    return `$filter=${SafetyCertificatesLibrary.getCertificatesFiltersCriteriaQuery(SafetyCertificatesLibrary.typeLOTO)}&$top=4`;
}

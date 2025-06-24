import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function LOTOCertificatesListViewNav(context) {
    return SafetyCertificatesLibrary.navigateToCertificatesList(context, SafetyCertificatesLibrary.typeLOTO);
}

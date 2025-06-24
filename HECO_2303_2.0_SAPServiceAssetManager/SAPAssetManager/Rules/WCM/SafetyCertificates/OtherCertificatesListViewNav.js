import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function OtherCertificatesListViewNav(context) {
    return SafetyCertificatesLibrary.navigateToCertificatesList(context, SafetyCertificatesLibrary.typeOTHER);
}

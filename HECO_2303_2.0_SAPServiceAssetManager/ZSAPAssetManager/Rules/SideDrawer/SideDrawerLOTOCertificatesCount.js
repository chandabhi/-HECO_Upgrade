import SafetyCertificatesLibrary from '../WCM/SafetyCertificates/SafetyCertificatesLibrary';

export default function SideDrawerLOTOCertificatesCount(context) {
    return SafetyCertificatesLibrary.getCertificatesLabelWithCount(context, SafetyCertificatesLibrary.typeLOTO);
}

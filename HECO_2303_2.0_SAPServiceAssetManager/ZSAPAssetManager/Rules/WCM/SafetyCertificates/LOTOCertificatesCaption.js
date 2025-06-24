import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function LOTOCertificatesCaption(context) {
    return SafetyCertificatesLibrary.getCertificatesListCaption(context, SafetyCertificatesLibrary.typeLOTO);
}

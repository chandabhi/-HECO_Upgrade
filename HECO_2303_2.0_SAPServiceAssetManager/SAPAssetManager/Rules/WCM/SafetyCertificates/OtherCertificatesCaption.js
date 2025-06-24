import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function OtherCertificatesCaption(context) {
    return SafetyCertificatesLibrary.getCertificatesListCaption(context, SafetyCertificatesLibrary.typeOTHER);
}

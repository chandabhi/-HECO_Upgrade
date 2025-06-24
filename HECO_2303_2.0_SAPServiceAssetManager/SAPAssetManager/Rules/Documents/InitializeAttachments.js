import DocLib from './DocumentLibrary';

export default function InitializeAttachments(formcellProxy) {
    let objectDetails = DocLib.getDocumentObjectDetail(formcellProxy);
    return DocLib.readAttachments(formcellProxy, objectDetails);
}

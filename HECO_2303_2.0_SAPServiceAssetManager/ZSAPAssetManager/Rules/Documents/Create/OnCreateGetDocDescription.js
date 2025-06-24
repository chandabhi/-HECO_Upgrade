import getDocsData from './DocumentOnCreateGetStateVars';

export default function OnCreategetDocDescription(pageProxy) {
    const { DocDescription } = getDocsData(pageProxy);
    return DocDescription;
}

import getDocsData from './DocumentOnCreateGetStateVars';
import libCom from '../../Common/Library/CommonLibrary';

export default function DocumentOnCreateWorkOrderId(controlProxy) {
    const { parentEntitySet } = getDocsData(controlProxy);
    let id = libCom.getStateVariable(controlProxy, 'LocalId');
    switch (parentEntitySet) {
        case 'MyWorkOrderOperations':
            //check to see if local WO
            if (id[0] === 'L') {
                let filter = `$filter=OrderId eq '${id}'`;
                return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], filter).then(result => {
                    if (result && result.length > 0) {
                        let entity = result.getItem(0);
                        return '<' + entity['@odata.readLink'] + ':' + 'OrderId' + '>';
                    } else {
                        return '0';
                    }
                });
            } else {
                return id;
            }
        case 'S4ServiceItems':
            return id;
        default:
            return '0';
    }
}

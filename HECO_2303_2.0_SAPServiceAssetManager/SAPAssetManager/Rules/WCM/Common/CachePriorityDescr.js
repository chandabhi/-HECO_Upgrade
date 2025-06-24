import libCom from '../../Common/Library/CommonLibrary';

export default function CachePriorityDescr(context) {
    let clientData = libCom.getClientDataForPage(context);
    if (clientData.Priorities === undefined) {
        libCom.cacheEntity(context, 'Priorities', '$select=Priority,PriorityDescription', ['Priority'], ['PriorityDescription'], clientData);
    }
}


export default function ZCrewListItemCrewId(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCom.getStateVariable(context, 'CrewHeaderCrewId');
}

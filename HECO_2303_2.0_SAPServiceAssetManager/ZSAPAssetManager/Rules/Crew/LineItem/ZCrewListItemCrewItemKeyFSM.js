import libCom from "../../Common/Library/CommonLibrary";

export default function ZCrewListItemCrewItemKeyFSM(context) {

    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libCom.getStateVariable(context, 'FSMCrewMembers')[libCom.getStateVariable(context, 'CrewItemKeyCounter')].CrewItemKey;
}

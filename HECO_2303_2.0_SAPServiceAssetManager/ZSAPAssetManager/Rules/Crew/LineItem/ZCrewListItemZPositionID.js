import libCom from "../../Common/Library/CommonLibrary";

export default function ZCrewListItemZPositionID(context) {

    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let crew = libCom.getStateVariable(context, 'FSMCrewMembers');
    let counter = libCom.getStateVariable(context, 'CrewItemKeyCounter');

    return crew[counter].ZPositionID;
}

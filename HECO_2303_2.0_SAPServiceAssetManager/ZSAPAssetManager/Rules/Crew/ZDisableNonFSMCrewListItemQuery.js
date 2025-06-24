import libCom from "../Common/Library/CommonLibrary";

export default function ZDisableNonFSMCrewListItemQuery(context) {
    let crew = libCom.getStateVariable(context, 'DisableCrewMembers');
    let counter = libCom.getStateVariable(context, 'CrewItemKeyCounter');
    return "$filter=CrewId eq '" + crew[counter].CrewId + "' and CrewItemKey eq '" + crew[counter].CrewItemKey + "'";
}

import libCom from '../../Common/Library/CommonLibrary';

export default function ZDisableCrewId(context) {

    let crew = libCom.getStateVariable(context, 'DisableCrewMembers');
    let counter = libCom.getStateVariable(context, 'CrewItemKeyCounter');
    return crew[counter].CrewId;
}

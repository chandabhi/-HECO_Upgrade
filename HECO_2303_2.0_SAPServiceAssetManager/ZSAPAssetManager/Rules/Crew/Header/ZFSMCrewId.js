import libCom from '../../Common/Library/CommonLibrary';

export default function ZFSMCrewId(context) {

    let crew = libCom.getStateVariable(context, 'FSMCrewMembers');
    let counter = libCom.getStateVariable(context, 'CrewItemKeyCounter');
    return crew[counter].CrewId;
}

import libCom from '../../Common/Library/CommonLibrary';

export default function ZCrewListItemFSMLinks(context) {
    var links = [];
    let row = libCom.getStateVariable(context, 'FSMCrewMembers')[libCom.getStateVariable(context, 'CrewItemKeyCounter')];
    links.push(
        {
            'Property': 'CrewList',
            'Target':
            {
                'EntitySet': 'CrewLists',
                'ReadLink': libCom.getStateVariable(context, 'CrewHeaderRow')['@odata.readLink'],
            },
        });

    links.push({
        'Property': 'Employee',
        'Target':
        {
            'EntitySet': 'Employees',
            'ReadLink': "Employees('" + row.CrewItemKey + "')",
        },
    });

    return links;
}

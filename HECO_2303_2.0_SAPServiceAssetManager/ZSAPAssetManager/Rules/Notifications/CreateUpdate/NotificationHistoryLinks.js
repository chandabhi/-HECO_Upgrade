import common from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import notif from '../NotificationLibrary';

export default function NotificationHistoryLinks(context) {
    let priorityType = context.binding ? context.binding.PriorityType : '';

    //HECO Priorities not used by CIS so skip priority linkage if unselected
    let priority = notif.NotificationCreateUpdatePrioritySegValue(context);
    if(priority) {
        let notificationType = notif.NotificationCreateUpdateTypeLstPkrValue(context);

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=NotifType eq '${notificationType}'`).then(function(data) {
            if (data.length) {
                priorityType = data.getItem(0).PriorityType;
            }
            return createLinks(context, priorityType, priority);
        });
    }

    return createLinks(context, priorityType);
}

function createLinks(context, priorityType, priority) {
    let linkPromises = [];
    var links = [];
    if(priority) {
        links = [{
            'Property': 'HistoryPriority_Nav',
            'Target':
            {
                'EntitySet': 'Priorities',
                'ReadLink': `Priorities(PriorityType='${priorityType}',Priority='${priority}')`,
            },
        }];
    }

    if (common.getStateVariable(context, 'isFollowOn') && context.binding && context.binding['@odata.readLink'] && context.binding['@odata.readLink'].includes('MyWorkOrderHeader')) {
        links.push({
            'Property': 'NotificationHeader_Nav',
            'Target':
            {
                'EntitySet': 'MyNotificationHeaders',
                'ReadLink': 'pending_1',
            },
        });

        links.push({
            'Property': 'RelatedWO_Nav',
            'Target':
            {
                'EntitySet': 'MyWorkOrderHeaders',
                'ReadLink': `MyWorkOrderHeaders('${context.binding.OrderId}')`,
            },
        });
    }

    var flocValue = common.getTargetPathValue(context, '#Control:FuncLocHierarchyExtensionControl/#Value');
    var equipmentValue = common.getTargetPathValue(context, '#Control:EquipHierarchyExtensionControl/#Value');
    if (equipmentValue && equipmentValue !== '' && !common.isCurrentReadLinkLocal(equipmentValue)) {
        links.push({
            'Property': 'Equipment_Nav',
            'Target':
            {
                'EntitySet': 'MyEquipments',
                'ReadLink': `MyEquipments('${equipmentValue}')`,
            },
        });
    } else if (flocValue && flocValue !== '' && !common.isCurrentReadLinkLocal(flocValue)) {
        links.push({
            'Property': 'FuncLoc_Nav',
            'Target':
            {
                'EntitySet': 'MyFunctionalLocations',
                'ReadLink': `MyFunctionalLocations('${flocValue}')`,
            },
        });
    }
    if (equipmentValue && equipmentValue !== '' && common.isCurrentReadLinkLocal(equipmentValue)) {
        linkPromises.push(
            common.getEntityProperty(context, `MyEquipments(${equipmentValue})`, 'EquipId').then(equipmentId => {
                let equipmentLink = context.createLinkSpecifierProxy(
                    'Equipment_Nav',
                    'MyEquipments',
                    `$filter=EquipId eq '${equipmentId}'`,
                );
                links.push(equipmentLink.getSpecifier());
                return links;
            }),
        );
    } else if (flocValue && flocValue !== '' && common.isCurrentReadLinkLocal(flocValue)) {
        linkPromises.push(
            common.getEntityProperty(context, `MyFunctionalLocations(${flocValue})`, 'FuncLocIdIntern').then(funcLocId => {
                let flocLink = context.createLinkSpecifierProxy(
                    'FuncLoc_Nav',
                    'MyFunctionalLocations',
                    `$filter=FuncLocIdIntern eq '${funcLocId}'`,
                );
                links.push(flocLink.getSpecifier());
                return links;
            }),
        );
    }

    if (linkPromises.length > 0) {
        return Promise.all(linkPromises).then(() => {
            return links;
        });
    }
    return links;
}

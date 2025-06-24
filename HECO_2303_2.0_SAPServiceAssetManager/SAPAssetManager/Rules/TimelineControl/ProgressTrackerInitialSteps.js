import common from '../Common/Library/CommonLibrary';
import OdataOffset from '../Common/Date/OffsetODataDate';
import Logger from '../Log/Logger';

export default function ProgressTrackerInitialSteps(context) {
    let statuses = [];
    let queryOptions = '';
    ///Get timeline statuses, nav links and query options to build the timeline 
    let entityset = common.getEntitySetName(context);
    switch (entityset) {
        case 'MyWorkOrderHeaders':
            ///Get timeline statuses from app params 
            statuses = common.getWOTimelineStatuses(context);
            queryOptions = "$filter=ObjectType eq 'WORKORDER'";
            entityset = `${context.getPageProxy().binding['@odata.readLink']}/OrderMobileStatus_Nav`;
            break;
        case 'MyWorkOrderOperations':
            ///Get timeline statuses from app params 
            statuses = common.getOperationsTimelineStatuses(context);
            queryOptions = "$filter=ObjectType eq 'WO_OPERATION'";
            entityset = `${context.getPageProxy().binding['@odata.readLink']}/OperationMobileStatus_Nav`;
            break;
        case 'MyWorkOrderSubOperations':
            ///Get timeline statuses from app params 
            statuses = common.getOperationsTimelineStatuses(context);
            queryOptions = "$filter=ObjectType eq 'WO_OPERATION'";
            entityset = `${context.getPageProxy().binding['@odata.readLink']}/SubOpMobileStatus_Nav`;
            break;
        case 'S4ServiceItems':
            ///Get timeline statuses from app params 
            statuses = common.getOperationsTimelineStatuses(context);
            queryOptions = "$filter=ObjectType eq 'S4_SRV_ITEM'";
            entityset = `${context.getPageProxy().binding['@odata.readLink']}/MobileStatus_Nav`;
            break;
        case 'S4ServiceOrders':
            statuses = common.getWOTimelineStatuses(context);
            queryOptions = '$filter=ObjectType eq \'S4_SRV_ORDER\'';
            entityset =`${context.getPageProxy().binding['@odata.readLink']}/MobileStatus_Nav`;
            break;
        case 'S4ServiceRequests':
            statuses = common.getWOTimelineStatuses(context);
            queryOptions = "$filter=ObjectType eq 'S4_SRV_REQUEST'";
            entityset =`${context.getPageProxy().binding['@odata.readLink']}/MobileStatus_Nav`;
            break;
        default:
            queryOptions = '';
            entityset = 'PMMobileStatuses';
            break;
    }

    ///Get the operation current status
    return context.read('/SAPAssetManager/Services/AssetManager.service', entityset, [], '$expand=OverallStatusCfg_Nav,PMMobileStatusHistory_Nav')
        .then(function(currentStatus) {
            ///translationKeys contains the all the translatable keys for the operation statuses
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], queryOptions).then((translationKeys) => {            
                return setUpInitialSteps(context, statuses, translationKeys, currentStatus);
            });
        })
        .catch(statusError => {
            Logger.error('Init progress tracker steps (status error)', statusError);

            //ICMTANGOAMF10-24605: fix for SO/SI with status issue
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.getPageProxy().binding['@odata.readLink'], [], '$expand=MobileStatus_Nav,MobileStatus_Nav/OverallStatusCfg_Nav,MobileStatus_Nav/PMMobileStatusHistory_Nav')
                .then(function(result) {
                    let currentStatus = result.getItem(0).MobileStatus_Nav;

                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], queryOptions).then((translationKeys) => {            
                        return setUpInitialSteps(context, statuses, translationKeys, currentStatus);
                    });
                })
                .catch(error => {
                    Logger.error('Init progress tracker steps', error);
                    return {  
                        SelectedStepIndex: -1,
                        Steps: [], 
                    };
                });
        });
}

function setUpInitialSteps(context, statuses, translationKeys = [], currentStatus = []) {
    let data = [];

    if (statuses && statuses.length) {
        statuses.forEach((status)=> {
            ////Status key is not part of the set of expected statuses
            if (translationKeys.findIndex(x => x.MobileStatus === status)<0) {
                data.push({
                    'State': 1,
                    'Title': context.localizeText(status),
                    'Subtitle': '',
                    'IsSelectable': false,
                });
            } else if (currentStatus.length && currentStatus.getItem(0).OverallStatusCfg_Nav && currentStatus.getItem(0).OverallStatusCfg_Nav.MobileStatus === status) {
                    ////Status key is current status
                    let timestamp = new OdataOffset(context, currentStatus.getItem(0).EffectiveTimestamp);
                    data.push({
                        'State': 2,
                        'Title': context.localizeText(translationKeys.getItem(translationKeys.findIndex(x => x.MobileStatus === status)).OverallStatusLabel),
                        'Subtitle': context.formatDatetime(new Date(timestamp.date().toISOString()), '', '', {format: 'short'} ),
                        'IsSelectable': false,
                    });
            } else if (currentStatus.length && currentStatus.getItem(0).PMMobileStatusHistory_Nav.findIndex(x => x.MobileStatus === status) >= 0) {
                    ///status key is a previous status on the timeline and it's on the histories
                    let timestamp = new OdataOffset(context, currentStatus.getItem(0).PMMobileStatusHistory_Nav[currentStatus.getItem(0).PMMobileStatusHistory_Nav.findIndex(x => x.MobileStatus === status)].EffectiveTimestamp);
                    data.push({
                        'State': 2,
                        'Title': context.localizeText(translationKeys.getItem(translationKeys.findIndex(x => x.MobileStatus === status)).OverallStatusLabel),
                        'Subtitle': context.formatDatetime(new Date(timestamp.date().toISOString()), '', '', {format: 'short'}),
                        'IsSelectable': false,
                    });
                } else {
                    ///status key is a previous status on the timeline and it's not on the histories
                    data.push({
                        'State': 1,
                        'Title': context.localizeText(translationKeys.getItem(translationKeys.findIndex(x => x.MobileStatus === status)).OverallStatusLabel),
                        'Subtitle': '',
                        'IsSelectable': false,
                    });
                }
        });    
    }

    return {
        SelectedStepIndex: -1,
        Steps: data, 
    };
}

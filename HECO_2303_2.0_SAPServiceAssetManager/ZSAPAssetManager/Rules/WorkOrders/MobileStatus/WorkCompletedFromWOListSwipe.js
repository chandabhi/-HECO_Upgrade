import common from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import mobilestatus from '../../MobileStatus/MobileStatusLibrary';
import ChangeMobileStatus from '../../ContextMenu/MobileStatus/ChangeMobileStatus';
import mobileStatusHistoryEntryCreate from '../../MobileStatus/MobileStatusHistoryEntryCreate';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';

/**
* Change status to Work Completed for WCM WO
* @param {IClientAPI} context
*/
export default function WorkCompletedFromWOListSwipe(context) {
	//Save the name of the page where user swipped the context menu from. It will be used later in common code that can be called from all kinds of different pages.
    common.setStateVariable(context, 'contextMenuSwipePage', common.getPageName(context));
    
    //Save the work order binding object first since we are coming from a context menu swipe which does not allow us to get binding object from context.binding.
    let binding = common.setBindingObject(context);

    const WORKCOMPLETED = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WorkCompletedParameterName.global').getValue();
	
	//Set ChangeStatus to 'Work Completed'.
	//ChangeStatus is used by WorkOrderMobileStatusFailureMessage.action & WorkOrderMobileStatusSuccessMessage.action
	context.getPageProxy().getClientData().ChangeStatus = WORKCOMPLETED;

	return context.executeAction({
		'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
		'Properties': {
            'Title': context.localizeText('confirm_status_change'),
            'Message': context.localizeText('change_wo_status_message', [context.localizeText(WORKCOMPLETED)]),
            'CancelCaption': context.localizeText('cancel'),
		},
	}).then(function(actionResult) {
		if (actionResult.data === true) {
			if (mobilestatus.isHeaderStatusChangeable(context)) {
				// Generate start time; save in app data
				let odataDate = new ODataDate();
				common.setStateVariable(context, 'StatusStartDate', odataDate.date());
				// Get Object Key
				let ObjectKey = (function() {
					if (binding.ObjectKey) {
						return binding.ObjectKey;
					} else if (binding.OrderMobileStatus_Nav.ObjectKey) {
						return binding.OrderMobileStatus_Nav.ObjectKey;
					} else {
						return '';
					}
				})();
				// Get Object Type
				let ObjectType = common.getAppParam(context,'OBJECTTYPE','WorkOrder');
				// Get Effective Timestamp
				let EffectiveTimestamp = odataDate.toDBDateTimeString(context);
				// Get user GUID
				let UserGUID = common.getUserGuid(context);
				//Get user name
				let UserId = common.getSapUserName(context);
				// Get ReadLink
				let ReadLink = (function() {
					if (binding.OrderMobileStatus_Nav) {
						return binding.OrderMobileStatus_Nav['@odata.readLink'];
					}
					return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/OrderMobileStatus_Nav', [], '').then(function(result) {
						return result.getItem(0)['@odata.readLink'];
					});
				})();

				// Run mobile status update
				return ChangeMobileStatus(context, ObjectKey, ObjectType, WORKCOMPLETED, EffectiveTimestamp, UserGUID, ReadLink, UserId).then(() => {
					let properites = {
						'MobileStatus': WORKCOMPLETED,
						'EffectiveTimestamp': EffectiveTimestamp,
						'CreateUserGUID': UserGUID,
						'CreateUserId': UserId,
					};
					return mobileStatusHistoryEntryCreate(context, properites, ReadLink);
				}).then(() => {
					// Status change succeeded. Show a message.
					return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusSuccessMessage.action').then(() => {
						return libAutoSync.autoSyncOnStatusChange(context);
					});
				}).catch(() => {
					// Something failed. Show a message.
					return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
				}).finally(() => {
					cleanUp(context);    
				});
			} else {
				return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action').finally(() => {
					cleanUp(context); 
				});
			}
		} else {
			return Promise.resolve();
		}
	});
}

function cleanUp(context) {
	common.removeBindingObject(context);
	common.removeStateVariable(context, 'contextMenuSwipePage');  
	delete context.getPageProxy().getClientData().ChangeStatus;
}

import ODataDate from '../Common/Date/ODataDate';
import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';
import PersonaLibrary from '../Persona/PersonaLibrary';
import DocumentLibrary from '../Documents/DocumentLibrary';
import PhaseLibrary from '../PhaseModel/PhaseLibrary';
import S4MobileStatusUpdateOverride from './Status/S4MobileStatusUpdateOverride';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import IsServiceItemCategory from './ServiceItems/IsServiceItemCategory';
import OffsetODataDate from '../Common/Date/OffsetODataDate';
import DocumentCreateDelete from '../Documents/Create/DocumentCreateDelete';
import Constants from '../Common/Library/ConstantsLibrary';
import { NoteLibrary } from '../Notes/NoteLibrary';
import nilGuid from '../Common/nilGuid';
import { WorkOrderEventLibrary } from '../WorkOrders/WorkOrderLibrary';
import ServiceContractValue from './Details/ServiceContractValue';
import ServiceContractItemValue from './Details/ServiceContractItemValue';
import { ValueIfCondition, ValueIfExists } from '../Common/Library/Formatter';
import { updateRefObjects } from './CreateUpdate/ServiceRequestCreateUpdateOnCommit';

export default class S4ServiceLibrary {

	static getServiceOrdersFilters(clientAPI) {
		return CommonLibrary.getStateVariable(clientAPI, 'SERVICEORDER_FILTER');
	}

	static setServiceOrdersFilters(clientAPI, filters) {
		CommonLibrary.setStateVariable(clientAPI, 'SERVICEORDER_FILTER', filters);
	}

	static getServiceItemsFilters(clientAPI) {
		return CommonLibrary.getStateVariable(clientAPI, 'SERVICEITEMS_FILTER');
	}

	static setConfirmationFilters(clientAPI, filters) {
		CommonLibrary.setStateVariable(clientAPI, 'CONFIRMATION_FILTER', filters);
	}

	static getConfirmationFilters(clientAPI) {
		return CommonLibrary.getStateVariable(clientAPI, 'CONFIRMATION_FILTER');
	}

	static setConfirmationItemFilters(clientAPI, filters) {
		CommonLibrary.setStateVariable(clientAPI, 'CONFIRMATIONITEM_FILTER', filters);
	}

	static getConfirmationItemFilters(clientAPI) {
		return CommonLibrary.getStateVariable(clientAPI, 'CONFIRMATIONITEM_FILTER');
	}

	static setServiceItemsFilters(clientAPI, filters) {
		CommonLibrary.setStateVariable(clientAPI, 'SERVICEITEMS_FILTER', filters);
	}

	static getServiceRequestsFilters(clientAPI) {
		return CommonLibrary.getStateVariable(clientAPI, 'SERVICEREQUEST_FILTER');
	}

	static setServiceRequestsFilters(clientAPI, filters) {
		CommonLibrary.setStateVariable(clientAPI, 'SERVICEREQUEST_FILTER', filters);
	}

	static setServiceOrdersFilterCriterias(clientAPI, filters) {
		CommonLibrary.setStateVariable(clientAPI, 'SERVICEORDERS_FILTER_CRITERIAS', filters);
	}

	static getServiceOrdersFilterCriterias(clientAPI) {
		return CommonLibrary.getStateVariable(clientAPI, 'SERVICEORDERS_FILTER_CRITERIAS');
	}

	static setServiceItemsFilterCriterias(clientAPI, filters) {
		CommonLibrary.setStateVariable(clientAPI, 'SERVICEITEMS_FILTER_CRITERIAS', filters);
	}

	static getServiceItemsFilterCriterias(clientAPI) {
		return CommonLibrary.getStateVariable(clientAPI, 'SERVICEITEMS_FILTER_CRITERIAS');
	}

	static checkIfItemIsServiceItem(clientAPI, item) {
		let serviceItemCategories = S4ServiceLibrary.getServiceProductItemCategories(clientAPI);
		let itemCategory = S4ServiceLibrary._getItemCategory(item);

		if (itemCategory) {
			return serviceItemCategories.includes(itemCategory);
		}

		return false;
	}

	static _getItemCategory(item) {
		let itemCategory = '';

		if (!item) return itemCategory;

		if (item.ItemCategory_Nav) {
			itemCategory = item.ItemCategory_Nav.ObjectType;
		}

		if (!itemCategory && item.ItemObjectType) {
			itemCategory = item.ItemObjectType;
		}

		return itemCategory;
	}

	/**
	* Returns filter criterias for the service items by categories
	* @param {IClientAPI} clientAPI
	* @param {Array} categories
	* @param {filterCaption} caption
	* @return {Array}
	*/
	static getItemsCategoriesFilterCriteria(clientAPI, categories, filterCaption) {
		let filters = [];
		if (categories && categories.length) {
			let query = '$filter=' + categories.map(category => {
				return `ObjectType eq '${category}'`;
			}).join(' or ');

			return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'ServiceItemCategories', [], query).then(items => {
				if (items.length) {
					const uniqueSet = new Set(items.map(item => item.ItemCategory));
					let filter = [...uniqueSet].map(category => {
						return `ItemCategory eq '${category}'`;
					});
					filters.push(clientAPI.createFilterCriteria(clientAPI.filterTypeEnum.Filter, undefined, filterCaption, [filter.join(' or ')], true, undefined, [filterCaption]));
				}

				return filters;
			});
		}

		return Promise.resolve(filters);
	}

	static getServiceProductItemCategories(clientAPI) {
		let parameterName = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/ServiceProductItem.global').getValue();
		let values = CommonLibrary.getAppParam(clientAPI, 'S4ITEMCATOBJECTYPE', parameterName); //BUS2000140, BUS2000143

		return S4ServiceLibrary._parseItemCategories(values);
	}

	static getServiceProductExpenseCategories(clientAPI) {
		let parameterName = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/ServiceExpenseItem.global').getValue();
		let values = CommonLibrary.getAppParam(clientAPI, 'S4ITEMCATOBJECTYPE', parameterName); //BUS2000159, BUS2000158

		return S4ServiceLibrary._parseItemCategories(values);
	}

	static getServiceProductPartCategories(clientAPI) {
		let parameterName = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/ServiceMaterialItem.global').getValue();
		let values = CommonLibrary.getAppParam(clientAPI, 'S4ITEMCATOBJECTYPE', parameterName); //BUS2000142, BUS2000146

		return S4ServiceLibrary._parseItemCategories(values);
	}

	static getServiceConfirmationCategories(clientAPI) {
		let parameterName = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/ServiceConfirmation.global').getValue();
		let values = CommonLibrary.getAppParam(clientAPI, 'BDSDOCUMENT', parameterName); //BUS2000117, BUS2000142, BUS2000143, BUS2000158

		return S4ServiceLibrary._parseItemCategories(values);
	}

	static _parseItemCategories(categoriesString) {
		let parseCategories = [categoriesString];

		if (categoriesString && categoriesString.includes(',')) {
			parseCategories = categoriesString.split(',').map(category => category.trim());
		}

		return parseCategories;
	}

	/**
	 * Gets the count of order by status and date
	 * @param {IClientAPI} clientAPI
	 * @param {Array} statuses
	 * @param {Date} date
	 * @return {number}
	 */
	static countOrdersByDateAndStatus(clientAPI, statuses, date) {
		return S4ServiceLibrary.ordersDateStatusFilterQuery(clientAPI, statuses, date).then(filter => {
			return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders', [], filter + '&$expand=MobileStatus_Nav').then(res => {
                return res.length;
            });
		});
	}

	/**
	 * Gets the count of all items
	 * @param {IClientAPI} clientAPI
	 * @return {number}
	 */
	static countAllS4ServiceItems(clientAPI) {
		return clientAPI.count(
			'/SAPAssetManager/Services/AssetManager.service',
			'S4ServiceItems',
		);
	}

	/**
	 * Gets the count of items by status and date
	 * @param {IClientAPI} clientAPI
	 * @param {Array} statuses
	 * @param {Date} date
	 * @param {string} extraFilterQuery
	 * @return {number}
	 */
	static countItemsByDateAndStatus(clientAPI, statuses, date, extraFilterQuery) {
		return S4ServiceLibrary.itemsDateStatusFilterQuery(clientAPI, statuses, date, extraFilterQuery).then(filter => {
			return clientAPI.count(
				'/SAPAssetManager/Services/AssetManager.service',
				'S4ServiceItems',
				filter,
			);
		});
	}

	/**
	 * Gets the count of items by order
	 * @param {IClientAPI} clientAPI
	 * @param {Array} statuses
	 * @param {Date} date
	 * @return {number}
	 */
	static countItemsByOrderId(clientAPI, objectID) {
		return clientAPI.count(
			'/SAPAssetManager/Services/AssetManager.service',
			'S4ServiceItems',
			`$filter=ObjectID eq '${objectID}'`,
		);
	}

	/**
	 * Gets the count of request by status and date
	 * @param {IClientAPI} clientAPI
	 * @param {Array} statuses
	 * @param {Date} date
	 * @return {number}
	 */
	static countRequestsByDateAndStatus(clientAPI, statuses, date) {
		return S4ServiceLibrary.ordersDateStatusFilterQuery(clientAPI, statuses, date).then(filter => {
			return clientAPI.count(
				'/SAPAssetManager/Services/AssetManager.service',
				'S4ServiceRequests',
				filter,
			);
		});
	}

	/**
	 * Provides filter query for the service orders by status and date
	 * @param {IClientAPI} clientAPI
	 * @param {Array} statuses
	 * @param {Date} date
	 * @return {string}
	 */
	static ordersDateStatusFilterQuery(clientAPI, statuses, date) {
		return S4ServiceLibrary.ordersDateFilter(clientAPI, date).then(dateFilter => {
			let statusFilter = S4ServiceLibrary.ordersStatusesFilter(statuses);
			return S4ServiceLibrary.combineFilters([statusFilter, dateFilter]);
		});
	}

	/**
	 * Provides filter query for the service items by status and date
	 * @param {IClientAPI} clientAPI
	 * @param {Array} statuses
	 * @param {Date} date
	 * @param {string} extraFilterQuery
	 * @return {string}
	 */
	static itemsDateStatusFilterQuery(clientAPI, statuses, date, extraFilterQuery = '') {
		return S4ServiceLibrary.itemsDateFilter(clientAPI, date).then(dateFilter => {
			let statusFilter = S4ServiceLibrary.itemsStatusesFilter(statuses);
			return S4ServiceLibrary.combineFilters([statusFilter, dateFilter, extraFilterQuery]);
		});
	}

	/**
	 * Provides filter query for the service requests by status and date
	 * @param {IClientAPI} clientAPI
	 * @param {Array} statuses
	 * @param {Date} date
	 * @return {string}
	 */
	static requestsDateStatusFilterQuery(clientAPI, statuses, date) {
		return S4ServiceLibrary.requestsDateFilter(clientAPI, date).then(dateFilter => {
			let statusFilter = S4ServiceLibrary.requestsStatusesFilter(statuses);
			return S4ServiceLibrary.combineFilters([statusFilter, dateFilter]);
		});
	}

	/**
	 * Provides query for the service items by service item types
	 * @param {IClientAPI} clientAPI
	 * @param {Array} statuses
	 * @param {Date} date
	 * @return {string}
	 */
	static itemsServiceItemTypesQuery(clientAPI) {
		let itemCategories = S4ServiceLibrary.getServiceProductItemCategories(clientAPI);
		let categoriesQuery = itemCategories.map(category => {
			return `ItemObjectType eq '${category}'`;
		}).join(' or ');

		return '(' + categoriesQuery + ')';
	}

	/**
	 * Combine several filters into one query
	 * @param {IClientAPI} clientAPI
	 * @param {Array} filters
	 * @return {string}
	 */
	static combineFilters(filters) {
		let combinedFilters = filters.filter(item => item !== '').join(' and ');
		if (combinedFilters) {
			return '$filter=' + combinedFilters;
		}

		return '';
	}

	/**
	 * Returns the filter for orders by statuses
	 * @param {Array} statuses
	 * @return {string}
	 */
	static ordersStatusesFilter(statuses) {
		return S4ServiceLibrary.statusesFilter(statuses, 'MobileStatus_Nav/MobileStatus');
	}

	/**
	 * Returns the filter for items by statuses
	 * @param {Array} statuses
	 * @return {string}
	 */
	static itemsStatusesFilter(statuses) {
		return S4ServiceLibrary.statusesFilter(statuses, 'MobileStatus_Nav/MobileStatus');
	}

	/**
	 * Returns the filter for requests by statuses
	 * @param {Array} statuses
	 * @return {string}
	 */
	static requestsStatusesFilter(statuses) {
		return S4ServiceLibrary.statusesFilter(statuses, '');
	}

	/**
	 * Returns the statuses filter
	 * @param {Array} statuses
	 * @param {string} filterByFiled
	 * @return {string}
	 */
	static statusesFilter(statuses, filterByFiled) {
		if (statuses && statuses.length && filterByFiled) {
			let filters = [];
			for (let i = 0; i < statuses.length; i++) {
				filters.push(`${filterByFiled} eq '${statuses[i]}'`);
			}
			return '(' + filters.join(' or ') + ')';
		}
		return '';
	}

	/**
	 * Returns the filter for orders by date
	 * @param {IClientAPI} clientAPI
	 * @param {Date} date
	 * @return {string}
	 */
	static ordersDateFilter(clientAPI, date) {
		const currentDate = new ODataDate(date).date();
		const oneDayAhead = (new Date(date)).setDate(date.getDate() + 1);
		const endDate = new ODataDate(oneDayAhead).date();

		let query = S4ServiceLibrary.dateFilterQuery(clientAPI, date, 'RequestedStart');
		return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders', [], query).then(result => {
			let filteredItems = [];

			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					let item = result.getItem(i);
					let itemStartDate = new ODataDate(item.RequestedStart).date();

					if (itemStartDate >= currentDate && itemStartDate < endDate) {
						filteredItems.push(`ObjectID eq '${item.ObjectID}'`);
					}
				}
			}

			return filteredItems.length > 0 ? `(${filteredItems.join(' or ')})` : false;
		});
	}

	/**
	 * Returns the filter for items by date
	 * @param {IClientAPI} clientAPI
	 * @param {Date} date
	 * @return {string}
	 */
	static itemsDateFilter(clientAPI, date) {
		const currentDate = new ODataDate(date).date();
		const oneDayAhead = (new Date(date)).setDate(date.getDate() + 1);
		const endDate = new ODataDate(oneDayAhead).date();

		let query = S4ServiceLibrary.dateFilterQuery(clientAPI, date, 'RequestedStart');
		return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceItems', [], query).then(result => {
			let filteredItems = [];

			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					let item = result.getItem(i);
					let itemStartDate = new ODataDate(item.RequestedStart).date();

					if (itemStartDate >= currentDate && itemStartDate < endDate) {
						filteredItems.push(`(ObjectID eq '${item.ObjectID}' and ItemNo eq '${item.ItemNo}')`);
					}
				}
			}

			return filteredItems.length > 0 ? `(${filteredItems.join(' or ')})` : false;
		});
	}

	/**
	 * Returns the filter for requests by date
	 * @param {IClientAPI} clientAPI
	 * @param {Date} date
	 * @return {string}
	 */
	static requestsDateFilter(clientAPI, date) {
		const currentDate = new ODataDate(date).date();
		const oneDayAhead = (new Date(date)).setDate(date.getDate() + 1);
		const endDate = new ODataDate(oneDayAhead).date();

		let query = S4ServiceLibrary.dateFilterQuery(clientAPI, date, 'RequestedStart');
		return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceRequests', [], query).then(result => {
			let filteredItems = [];

			if (result.length > 0) {
				for (let i = 0; i < result.length; i++) {
					let item = result.getItem(i);
					let itemStartDate = new ODataDate(item.RequestedStart).date();

					if (itemStartDate >= currentDate && itemStartDate < endDate) {
						filteredItems.push(`(ObjectID eq '${item.ObjectID}'`);
					}
				}
			}

			return filteredItems.length > 0 ? `(${filteredItems.join(' or ')})` : false;
		});
	}

	/**
	 * Returns the filter query by date
	 * @param {IClientAPI} clientAPI
	 * @param {Date} date
	 * @param {string} filterByFiled
	 * @return {string}
	*/
	static dateFilterQuery(clientAPI, date, filterByFiled) {
		const oneDayBack = (new Date(date)).setDate(date.getDate() - 1);
		const startDate = new ODataDate(oneDayBack).queryString(clientAPI, 'date');

		const oneDayAhead = (new Date(date)).setDate(date.getDate() + 1);
		const endDate = new ODataDate(oneDayAhead).queryString(clientAPI, 'date');

		return `$filter=${filterByFiled} ge ${startDate} and ${filterByFiled} le ${endDate}`;
	}

	/**
	 * Returns captioned count of available items based on input values
	 * template for the all captions on the header
	 * all labels and queries are imported from outside
	 * @param {IClientAPI} clientAPI
	 * @param {string} entitySet
	 * @param {string} totalQueryOption
	 * @param {string} queryOption
	 * @param {string} equalLabel
	 * @param {string} diffLabel
	 * @return {string}
	*/
	static getListCountCaption(clientAPI, entitySet, totalQueryOption, queryOption, equalLabel, diffLabel) {
		let totalCountPromise = clientAPI.count('/SAPAssetManager/Services/AssetManager.service', entitySet, totalQueryOption);
		let countPromise = clientAPI.count('/SAPAssetManager/Services/AssetManager.service', entitySet, queryOption);
		return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
			let totalCount = resultsArray[0];
			let count = resultsArray[1];
			let caption = '';

			if (count === totalCount) {
				caption = clientAPI.localizeText(equalLabel, [totalCount]);
			} else {
				caption = clientAPI.localizeText(diffLabel, [count, totalCount]);
			}

			return caption;
		});
	}

	/**
	 * Return filters by selected fast filters
	 * @param {IClientAPI} clientAPI
	 * @param {string} defPageName
	*/
	static getCaptionQuery(clientAPI, defPageName) {
		const pageName = CommonLibrary.getPageName(clientAPI);
		let filterQueryOptions = '';

		//Collect filters from filter page and quick filters and update caption on list page
		if (pageName === defPageName && clientAPI.filters && clientAPI.filters.length) {
			const filters = [];
			clientAPI.filters.forEach((filter) => {
				//ignore sorting and etc
				if (filter.type !== 1) {
					return;
				}
				const groupFilters = [];

				filter.filterItems.forEach((item) => {
					if (filter.name && !item.includes(filter.name)) {
						groupFilters.push(`${filter.name} eq '${item}'`);
					} else {
						groupFilters.push(item);
					}
				});

				if (groupFilters.length) {
					filters.push(`(${groupFilters.join(' or ')})`);
				}
			});

			filterQueryOptions = filters.length ? `${filters.join(' or ')}` : '';
		}

		return filterQueryOptions;
	}

	/**
	 * Checks to see if at least one item has been started from all of the items (service order or items)
	 * Returns a Promise whose value is true if at least one item is in started status and false otherwise.
	 *
	 * @param {IClientAPI} clientAPI
	 * @param {string} entityName
	 * @param {string} stateVariableName
	 * @return {string}
	 */
	static isAnythingStarted(clientAPI, entityName = 'S4ServiceOrders', stateVariableName = 'isAnyOrderStarted') {
		let isAnyStarted = false;

		let startedStatus = CommonLibrary.getAppParam(clientAPI, 'MOBILESTATUS', clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
		let queryOption = `$expand=MobileStatus_Nav&$filter=MobileStatus_Nav/MobileStatus eq '${startedStatus}'`;

		return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', entityName, [], queryOption)
			.then(startedItemsList => {
				if (startedItemsList && startedItemsList.length > 0) {
					isAnyStarted = true;
				}

				CommonLibrary.setStateVariable(clientAPI, stateVariableName, isAnyStarted);
				return Promise.resolve(isAnyStarted);
			})
			.catch(error => {
				Logger.error('MobileStatus', error);
				CommonLibrary.setStateVariable(clientAPI, stateVariableName, false);
				return Promise.resolve(false);
			});
	}

	static getAvailableStatuses(clientAPI, S4Order, check) {
		let statuses = [];

		const { ACCEPTED, STARTED, COMPLETE, TRANSFER, REJECTED, HOLD, REVIEW, APPROVE, DISAPPROVE, TRAVEL, ONSITE } = MobileStatusLibrary.getMobileStatusValueConstants(clientAPI);
		const orderStatusObjectType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/OrderMobileStatusObjectType.global').getValue();
		let entitySet = S4Order['@odata.readLink'] + '/MobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav';
		let queryOptions = `$expand=NextOverallStatusCfg_Nav&$filter=NextOverallStatusCfg_Nav/ObjectType eq '${orderStatusObjectType}'`;

		if (!IsPhaseModelEnabled(clientAPI)) {
			queryOptions += ` and UserPersona eq '${PersonaLibrary.getActivePersona(clientAPI)}'`;
		}

		return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', S4Order['@odata.readLink'], [], '$expand=MobileStatus_Nav/OverallStatusCfg_Nav').then(rollback => {
			CommonLibrary.setStateVariable(clientAPI, 'PhaseModelRollbackStatus', rollback.getItem(0).MobileStatus_Nav); //Save the rollback state to use if necessary

			return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(codes => {
				if (codes.length) {
					codes.forEach(status => {
						let nextStatus = status.NextOverallStatusCfg_Nav;
						let transitionText = nextStatus.OverallStatusLabel;

						if (nextStatus.TransitionTextKey) {
							transitionText = clientAPI.localizeText(nextStatus.TransitionTextKey);
						}

						if (status.RoleType === check.currentRole) {
							if (nextStatus.MobileStatus === REVIEW && check.isReviewRequired) {
								statuses.push({
									'Title': transitionText,
									'OnPress': '/SAPAssetManager/Rules/ServiceOrders/Status/NavOnCompleteServiceOrderPage.js',
								});
							}
						}

						if (nextStatus.MobileStatus === REJECTED) {
							CommonLibrary.setStateVariable(clientAPI, 'PhaseModelStatusElement', nextStatus);
							statuses.push({
								'Title': transitionText,
								'OnPress': '/SAPAssetManager/Rules/Supervisor/Reject/RejectReasonPhaseModelNav.js',
							});
						}

						if (nextStatus.MobileStatus === HOLD) {
							statuses.unshift({
								'Title': transitionText,
								'OnPress': {
									'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
									'Properties': {
										'Title': clientAPI.localizeText('confirm_status_change'),
										'CancelCaption': clientAPI.localizeText('cancel'),
										'Message': clientAPI.localizeText('hold_service_order'),
										'OnOK': S4MobileStatusUpdateOverride(clientAPI, S4Order, nextStatus),
									},
								},
							});
						}

						if (nextStatus.MobileStatus === COMPLETE && (check.currentRole === 'S' || (check.currentRole === 'T' && !check.isReviewRequired))) {
							statuses.push({
								'Title': transitionText,
								'OnPress': '/SAPAssetManager/Rules/ServiceOrders/Status/NavOnCompleteServiceOrderPage.js',
							});
						}

						if (nextStatus.MobileStatus === TRANSFER) {
							statuses.push({
								'Title': transitionText,
								'OnPress': '/SAPAssetManager/Actions/ServiceOrders/Status/ServiceOrderTransferNav.action',
							});
						}

						if (nextStatus.MobileStatus === STARTED && !check.isAnythingStarted) {
							statuses.push({
								'Title': transitionText,
								'OnPress': S4MobileStatusUpdateOverride(clientAPI, S4Order, nextStatus),
							});
						}

						if ((nextStatus.MobileStatus === APPROVE || nextStatus.MobileStatus === DISAPPROVE)
							&& PhaseLibrary.supervisorStatusChangeAllowed(clientAPI, status) && check.isPhaseModelActiveInDataObject) {
							statuses.push({
								'Title': transitionText,
								'OnPress': S4MobileStatusUpdateOverride(clientAPI, S4Order, nextStatus),
							});
						}

						if (nextStatus.MobileStatus === ACCEPTED || nextStatus.MobileStatus === TRAVEL || nextStatus.MobileStatus === ONSITE) {
							statuses.push({
								'Title': transitionText,
								'OnPress': S4MobileStatusUpdateOverride(clientAPI, S4Order, nextStatus),
							});
						}
					});
				}

				return statuses;
			});
		}).catch(() => {
			return statuses;
		});

	}

	static getAvailableStatusesServiceRequest(clientAPI, S4Request, check) {
		let statuses = [];

		const { STARTED, COMPLETE, REJECTED } = MobileStatusLibrary.getMobileStatusValueConstants(clientAPI);
		const requestStatusObjectType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/RequestMobileStatusObjectType.global').getValue();
		let entitySet = S4Request['@odata.readLink'] + '/MobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav';
		let queryOptions = `$expand=NextOverallStatusCfg_Nav&$filter=NextOverallStatusCfg_Nav/ObjectType eq '${requestStatusObjectType}'`;

		if (!IsPhaseModelEnabled(clientAPI)) {
			queryOptions += ` and UserPersona eq '${PersonaLibrary.getActivePersona(clientAPI)}'`;
		}

		return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', S4Request['@odata.readLink'], [], '$expand=MobileStatus_Nav/OverallStatusCfg_Nav').then(rollback => {
			CommonLibrary.setStateVariable(clientAPI, 'PhaseModelRollbackStatus', rollback.getItem(0).MobileStatus_Nav); //Save the rollback state to use if necessary

			return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(codes => {
				if (codes.length) {
					codes.forEach(status => {
						let nextStatus = status.NextOverallStatusCfg_Nav;
						let transitionText = nextStatus.OverallStatusLabel;

						if (nextStatus.TransitionTextKey) {
							transitionText = clientAPI.localizeText(nextStatus.TransitionTextKey);
						}

						if (nextStatus.MobileStatus === REJECTED) {
							CommonLibrary.setStateVariable(clientAPI, 'PhaseModelStatusElement', nextStatus);
							statuses.push({
								'Title': transitionText,
								'OnPress': '/SAPAssetManager/Rules/Supervisor/Reject/RejectReasonPhaseModelNav.js',
							});
						}

						if (nextStatus.MobileStatus === COMPLETE && (check.currentRole === 'S' || (check.currentRole === 'T' && !check.isReviewRequired))) {
							statuses.push({
								'Title': transitionText,
								'OnPress': {
									'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
									'Properties': {
										'Title': clientAPI.localizeText('confirm_status_change'),
										'CancelCaption': clientAPI.localizeText('cancel'),
										'Message': clientAPI.localizeText('complete_service_request'),
										'OnOK': S4MobileStatusUpdateOverride(clientAPI, S4Request, nextStatus),
										'OnSuccess': '/SAPAssetManager/Actions/Page/ClosePage.action',
									},
								},
							});
						}

						if (nextStatus.MobileStatus === STARTED) {
							statuses.push({
								'Title': transitionText,
								'OnPress': S4MobileStatusUpdateOverride(clientAPI, S4Request, nextStatus),
							});
						}
					});
				}

				return statuses;
			});
		}).catch(() => {
			return statuses;
		});
	}

	static getAvailableStatusesServiceItem(clientAPI) {
		let statuses = [];
		let currentStatus;
		const binding = clientAPI.binding;

		if (!MobileStatusLibrary.isServiceItemStatusChangeable(clientAPI)) {
			return this.getConfirmStatusServiceItem(clientAPI, binding, statuses);
		}

		const { STARTED, COMPLETE, TRANSFER, REJECTED, HOLD, RECEIVED } = MobileStatusLibrary.getMobileStatusValueConstants(clientAPI);
		const itemStatusObjectType = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ItemMobileStatusObjectType.global').getValue();
		const entitySet = binding['@odata.readLink'] + '/MobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav';
		const queryOptions = `$expand=NextOverallStatusCfg_Nav&$filter=NextOverallStatusCfg_Nav/ObjectType eq '${itemStatusObjectType}' and UserPersona eq '${PersonaLibrary.getActivePersona(clientAPI)}'`;
		const isServiceItem = IsServiceItemCategory(clientAPI);

		return S4ServiceLibrary.isAnythingStarted(clientAPI, 'S4ServiceItems').then(isAnythingStarted => {
			return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '$expand=MobileStatus_Nav/OverallStatusCfg_Nav').then(rollback => {
				CommonLibrary.setStateVariable(clientAPI, 'PhaseModelRollbackStatus', rollback.getItem(0).MobileStatus_Nav); //Save the rollback state to use if necessary
				currentStatus = rollback.getItem(0).MobileStatus_Nav.MobileStatus;
				return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(codes => {
					if (codes.length) {
						codes.forEach(status => {
							let statusElement = status.NextOverallStatusCfg_Nav;
							let transitionText = statusElement.OverallStatusLabel;

							if (statusElement.TransitionTextKey) {
								transitionText = clientAPI.localizeText(statusElement.TransitionTextKey);
							}

							if (statusElement.MobileStatus === REJECTED) {
								CommonLibrary.setStateVariable(clientAPI, 'PhaseModelStatusElement', statusElement);
								statuses.push({
									'Title': transitionText,
									'OnPress': '/SAPAssetManager/Rules/Supervisor/Reject/RejectReasonPhaseModelNav.js',
								});
							} else if (statusElement.MobileStatus === HOLD && isServiceItem) {
								statuses.push({
									'Title': transitionText,
									'OnPress': {
										'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
										'Properties': {
											'Title': clientAPI.localizeText('confirm_status_change'),
											'CancelCaption': clientAPI.localizeText('cancel'),
											'Message': clientAPI.localizeText('hold_service_item'),
											'OnOK': S4MobileStatusUpdateOverride(clientAPI, binding, statusElement),
										},
									},
								});
							} else if (statusElement.MobileStatus === COMPLETE) {
								if (!(currentStatus === RECEIVED && isServiceItem)) { // exclude the complete option that we have for non-service items
									statuses.push({
										'Title': transitionText,
										'OnPress': '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/MobileStatus/NavOnCompleteServiceItemPage.js',
									});
								}
							} else if (statusElement.MobileStatus === TRANSFER && isServiceItem) {
								statuses.push({
									'Title': transitionText,
									'OnPress': '/SAPAssetManager/Actions/ServiceOrders/ServiceItems/MobileStatus/ServiceItemTransferNav.action',
								});
							} else if (!(statusElement.MobileStatus === STARTED && isAnythingStarted) && isServiceItem) {
								statuses.push({
									'Title': transitionText,
									'OnPress': S4MobileStatusUpdateOverride(clientAPI, binding, statusElement),
								});
							}
						});
					}

					return statuses;
				});
			});
		}).catch(err => {
			Logger.debug(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMobileStatus.global').getValue(), err);
			return statuses;
		});
	}

	static getConfirmStatusServiceItem(clientAPI, binding, statuses) {
		let mobileStatusReadLink = binding['@odata.readLink'] + '/S4ServiceOrder_Nav';
		const { STARTED } = MobileStatusLibrary.getMobileStatusValueConstants(clientAPI);

		return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', mobileStatusReadLink, [], '$expand=MobileStatus_Nav&$select=MobileStatus_Nav/MobileStatus').then(result => {
			if (result.length && result.getItem(0).MobileStatus_Nav && result.getItem(0).MobileStatus_Nav.MobileStatus === STARTED) {
				return this.isServiceObjectCompleted(clientAPI, binding).then(isCompleted => {
					if (isCompleted && binding.MobileStatus_Nav['@sap.isLocal']) {
						statuses.push({
							'Title': clientAPI.localizeText('unconfirm'),
							'OnPress': '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/ServiceItemUnconfirmStatus.js',
						});
					} else if (!isCompleted) {
						statuses.push({
							'Title': clientAPI.localizeText('confirm_and_complete'), 
							'OnPress': '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/ServiceItemConfirmStatus.js',
						});
					}
					return statuses;
				});
			}
			return statuses;
		});
	}

	static confirmationStatusUpdateConfirm(clientAPI) {
		const binding = clientAPI.binding;
		if (binding) {
			const isFinal = binding.FinalConfirmation === 'Y';
			return clientAPI.executeAction({
				'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
				'Properties': {
					'CancelCaption': clientAPI.localizeText('cancel'),
					'OKCaption': clientAPI.localizeText('yes'),
					'Title': clientAPI.localizeText('confirm_status_change'),
					'Message': clientAPI.localizeText('completion_s4_conf_message'),
				},
			}).then(({ data }) => {
				if (data === false) {
					return false;
				}
				if (isFinal) {
					return clientAPI.executeAction({
						'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
						'Properties': {
							'CancelCaption': clientAPI.localizeText('cancel'),
							'OKCaption': clientAPI.localizeText('yes'),
							'Title': clientAPI.localizeText('complete_all_items'),
							'Message': clientAPI.localizeText('completion_s4_conf_final_message'),
						},
					}).then(({ data: newData }) => {
						return this.confirmationStatusChange(clientAPI, binding).then(() => {
							return newData !== false && this.confirmationServiceItemsStatusChange(clientAPI, binding);
						});
					});
				}
				return this.confirmationStatusChange(clientAPI, binding);
			});
		}
		return Promise.resolve();
	}

	static confirmationItemStatusUpdateConfirm(clientAPI) {
		const binding = clientAPI.binding;
		if (binding) {
			return clientAPI.executeAction({
				'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
				'Properties': {
					'CancelCaption': clientAPI.localizeText('cancel'),
					'OKCaption': clientAPI.localizeText('yes'),
					'Title': clientAPI.localizeText('confirm_status_change'),
					'Message': clientAPI.localizeText('completion_s4_conf_item_message'),
				},
			}).then(({ data }) => {
				if (data === false) {
					return false;
				}
				return this.confirmationItemStatusChange(clientAPI, binding);
			});
		}
		return Promise.resolve();
	}

	static confirmationServiceItemsStatusChange(clientAPI, binding) {
		const query = `$expand=TransHistories_Nav/S4ServiceConfirms_Nav,ServiceItems_Nav&$filter=TransHistories_Nav/any(wp: (wp/S4ServiceConfirms_Nav/ObjectID eq '${binding.ObjectID}'))&$select=ServiceItems_Nav/ItemNo,TransHistories_Nav/S4ServiceConfirms_Nav/ObjectID&$top=1`;
		return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders', [], query).then(result => {
			if (result) {
				const item = result.getItem(0);
				if (item.ServiceItems_Nav && item.ServiceItems_Nav.length) {
					const updatePromises = [];
					item.ServiceItems_Nav.forEach(newBinding => {
						updatePromises.push(this.confirmationItemStatusChange(clientAPI, newBinding));
					});
					return Promise.all(updatePromises);
				}
			}
			return Promise.resolve();
		});
	}

	static confirmationStatusChange(clientAPI, binding) {
		let updatePromises = [];
		if (binding.ServiceConfirmationItems_Nav && binding.ServiceConfirmationItems_Nav.length) {
			binding.ServiceConfirmationItems_Nav.forEach((newBinding) => {
				updatePromises.push(this.confirmationItemStatusChange(clientAPI, newBinding));
			});
		}
		return Promise.all(updatePromises).then(() => {
			return this.confirmationItemStatusChange(clientAPI, binding);
		});
	}

	static confirmationItemStatusChange(clientAPI, binding) {
		const entitySet = binding['@odata.readLink'] + '/MobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav';
		const queryOptions = '$expand=NextOverallStatusCfg_Nav';
		const { OPEN, COMPLETE } = MobileStatusLibrary.getMobileStatusValueConstants(clientAPI);
		const isServiceItems = binding['@odata.type'] === '#sap_mobile.S4ServiceItem';
		const selectItems = [];
		if (binding.ItemNo) {
			selectItems.push('ItemNo');
		}
		if (binding.ItemObjectType) {
			selectItems.push('ItemObjectType');
		}
		const itemQueryOptions = `$expand=MobileStatus_Nav&$select=MobileStatus_Nav/MobileStatus,MobileStatus_Nav/ObjectKey,ObjectType,ObjectID${selectItems.length ? `,${selectItems.join(',')}` : ''}`;
		
		return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], itemQueryOptions).then(result => {
			if (isServiceItems || (result.length && result.getItem(0).MobileStatus_Nav && result.getItem(0).MobileStatus_Nav.MobileStatus === OPEN)) {
				return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(codes => {
					if (codes.length) {
						codes.forEach(status => {
							let statusElement = status.NextOverallStatusCfg_Nav;
							if (statusElement.MobileStatus === COMPLETE) {
								return clientAPI.executeAction(S4MobileStatusUpdateOverride(clientAPI, result.getItem(0), statusElement));
							}
							return Promise.resolve();
						});
					}
					return Promise.resolve();
				});
			}
			return Promise.resolve();
		});
	}

	/**
   * Gets the count of items by category
   * @param {IClientAPI} clientAPI
   * @param {Array} categories
   * @return {number}
   */
	static countItemsByCategory(clientAPI, categories) {
		return S4ServiceLibrary.itemsCategoriesFilterQuery(categories).then(filter => {
			return clientAPI.count(
				'/SAPAssetManager/Services/AssetManager.service',
				'S4ServiceItems',
				filter + '&$expand=ItemCategory_Nav',
			);
		});
	}

	/**
	* Provides filter query for the service items by categories
	* @param {Array} categories
	* @return {string}
	*/
	static itemsCategoriesFilterQuery(categories) {
		let categoriesFilter = '';

		if (categories && categories.length) {
			categoriesFilter = categories.map(category => {
				return `ItemCategory_Nav/ObjectType eq '${category}'`;
			}).join(' or ');
		}

		return Promise.resolve(S4ServiceLibrary.combineFilters([categoriesFilter]));
	}

	static getServiceOrderObjectType(clientAPI) {
		let parameterName = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/ServiceOrder.global').getValue();
		return CommonLibrary.getAppParam(clientAPI, 'S4OBJECTTYPE', parameterName);
	}

	static getServiceRequestObjectType(clientAPI) {
		let parameterName = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/ServiceRequest.global').getValue();
		return CommonLibrary.getAppParam(clientAPI, 'S4OBJECTTYPE', parameterName);
	}

	static getServiceConfirmationObjectType(clientAPI) {
		let parameterName = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/Confirmation.global').getValue();
		return CommonLibrary.getAppParam(clientAPI, 'S4OBJECTTYPE', parameterName);
	}

	static getServiceConfirmationItemObjectType(clientAPI) {
		let parameterName = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/Confirmation.global').getValue();
		return CommonLibrary.getAppParam(clientAPI, 'S4OBJECTTYPE', parameterName);
	}

	static requestsS4FooterCaption(clientAPI) {
		const binding = clientAPI.binding;
		if (binding) {
			if (!this.isServiceRequest(binding)) {
				return `${binding.NetValue} ${binding.NetValue ? binding.Currency : ''}`;
			}
			if (binding.DueBy) {
				const dateView = CommonLibrary.dateStringToUTCDatetime(binding.DueBy);
				return CommonLibrary.getFormattedDate(dateView, clientAPI);
			}
		}
		return '';
	}

	static isServiceObjectCompleted(clientAPI, serviceObject, mobileStatusObject) {
		const COMPLETE = CommonLibrary.getAppParam(clientAPI, 'MOBILESTATUS', clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

		if (mobileStatusObject && mobileStatusObject.MobileStatus) {
			return Promise.resolve(mobileStatusObject.MobileStatus === COMPLETE);
		}

		if (!mobileStatusObject && serviceObject) {
			let mobileStatusReadLink = serviceObject['@odata.readLink'] + '/MobileStatus_Nav';
			return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', mobileStatusReadLink, [], '$select=MobileStatus').then(result => {
				if (result.length) {
					return result.getItem(0).MobileStatus === COMPLETE;
				}
				return false;
			});
		}

		return Promise.resolve(false);
	}

	static getDataFromRefObjects(clientAPI, type) {
		let binding = clientAPI.binding;
		let data = '';
		if (binding && binding.RefObjects_Nav && binding.RefObjects_Nav.length) {
			binding.RefObjects_Nav.forEach(val => {
				switch (type) {
					case 'Material_Nav':
						if (val.Material_Nav && val.Material_Nav.Description) {
							data += `${val.Material_Nav.Description},`;
						}
						break;
					case 'MyEquipment_Nav':
						if (val.MyEquipment_Nav && val.MyEquipment_Nav.EquipDesc) {
							data += `${val.MyEquipment_Nav.EquipDesc},`;
						}
						break;
					case 'MyFunctionalLocation_Nav':
						if (val.MyFunctionalLocation_Nav && val.MyFunctionalLocation_Nav.FuncLocDesc) {
							data += `${val.MyFunctionalLocation_Nav.FuncLocDesc},`;
						}
						break;
				}
			});
		}
		if (!data.length) {
			data = '-';
		}
		return data;
	}

	/**
	 * Set the ChangeSet flag
	 * @param {IclientAPI} clientAPI
	 * @param {boolean} flagValue
	 */
	static setOnSOChangesetFlag(clientAPI, flagValue) {
		const callingPage = CommonLibrary.getPageName(clientAPI) || 'unknown';
		Logger.info('***STATE VARIABLE***', `Service Order Change Set Flag set to ${flagValue}. Calling Page: ${callingPage}`);
		CommonLibrary.setStateVariable(clientAPI, 'ONSOCHANGESET', flagValue);
	}

	/**
	* Set the ChangeSet flag
	* @param {IclientAPI} clientAPI
	* @param {boolean} flagValue
	*/
	static setOnSRChangesetFlag(clientAPI, flagValue) {
		const callingPage = CommonLibrary.getPageName(clientAPI) || 'unknown';
		Logger.info('***STATE VARIABLE***', `Service Request Change Set Flag set to ${flagValue}. Calling Page: ${callingPage}`);
		CommonLibrary.setStateVariable(clientAPI, 'ONSRCHANGESET', flagValue);
	}

	/**
	 * check if we are in the middle of the SO changeset action
	 * @param {IclientAPI} clientAPI
	 */
	static isOnSOChangeset(clientAPI) {
		return CommonLibrary.getStateVariable(clientAPI, 'ONSOCHANGESET');
	}

	/**
	* check if we are in the middle of the SR changeset action
	* @param {IclientAPI} clientAPI
	* @returns {boolean} flagValue
	*/
	static isOnSRChangeset(clientAPI) {
		return CommonLibrary.getStateVariable(clientAPI, 'ONSRCHANGESET');
	}

	/**
	 * Save the values and navigate to item creation modal after the user hit "Save" button
	 * @param {IclientAPI} clientAPI
	 */
	static ServiceOrderCreateUpdateOnCommit(clientAPI) {
		const onCreate = CommonLibrary.IsOnCreate(clientAPI);

		if (onCreate) {
			let descriptionCtrlValue = clientAPI.getControl('FormCellContainer').getControl('AttachmentDescription').getValue();
			let attachmentCtrlValue = clientAPI.getControl('FormCellContainer').getControl('Attachment').getValue();
			CommonLibrary.setStateVariable(clientAPI, 'DocDescription', descriptionCtrlValue);
			CommonLibrary.setStateVariable(clientAPI, 'Doc', attachmentCtrlValue);
			CommonLibrary.setStateVariable(clientAPI, 'Class', 'ServiceOrder');
			CommonLibrary.setStateVariable(clientAPI, 'ObjectKey', 'ObjectID');
			CommonLibrary.setStateVariable(clientAPI, 'entitySet', 'S4ServiceOrderDocuments');
			CommonLibrary.setStateVariable(clientAPI, 'parentEntitySet', 'S4ServiceOrders');
			CommonLibrary.setStateVariable(clientAPI, 'parentProperty', 'S4ServiceOrder_Nav');
			CommonLibrary.setStateVariable(clientAPI, 'attachmentCount', DocumentLibrary.validationAttachmentCount(clientAPI));

			return clientAPI.executeAction('/SAPAssetManager/Actions/ServiceItems/ServiceItemCreateUpdateNav.action');
		} else {
			return clientAPI.executeAction('/SAPAssetManager/Actions/ServiceOrders/CreateUpdate/ServiceOrderUpdate.action');
		}
	}

	/**
	 * On success rule for service order update
	 * @param {IclientAPI} clientAPI
	 */
	static ServiceOrderUpdateOnSuccess(clientAPI) {
		let binding = clientAPI.binding;
		let noteAction;
		const type = NoteLibrary.getNoteTypeTransactionFlag(clientAPI);
		if (!type) {
			throw new TypeError('Note Transaction Type must be defined');
		}
		const note = CommonLibrary.getStateVariable(clientAPI, Constants.noteStateVariable);
		if (note) {
			if (type.noteUpdateAction) {
				CommonLibrary.setStateVariable(clientAPI, Constants.stripNoteNewTextKey, true);
				noteAction = type.noteUpdateAction;
			}
		} else if (type.noteCreateAction) {
			noteAction = type.noteCreateAction;
		}
		return clientAPI.executeAction(noteAction).then(() => {
			return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/RefObjects_Nav`, [], '').then(results => {
				if (results && results.length > 0) {
					clientAPI.binding.refObjectReadLink = results.getItem(0)['@odata.readLink'];
					return clientAPI.executeAction('/SAPAssetManager/Actions/ReferenceObjects/ServiceOrderRefObjectUpdate.action').then(() => {
						return DocumentCreateDelete(clientAPI);
					});
				}
				return DocumentCreateDelete(clientAPI);
			});
		}).catch(error => {
			Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryServiceOrder.global').getValue(), `update failed: ${error}`);
		});
	}
	
	/**
	 * On success rule for service order update
	 * @param {IclientAPI} clientAPI
	 */
	static ServiceRequestUpdateOnSuccess(clientAPI) {
		let binding = clientAPI.binding;
		let noteAction = Promise.resolve();
		const type = NoteLibrary.getNoteTypeTransactionFlag(clientAPI);
		if (!type) {
			Logger.error('Note Transaction Type must be defined');
		}
		const note = CommonLibrary.getStateVariable(clientAPI, Constants.noteStateVariable);
		if (note) {
			if (type.noteUpdateAction) {
				CommonLibrary.setStateVariable(clientAPI, Constants.stripNoteNewTextKey, true);
				noteAction = clientAPI.executeAction(type.noteUpdateAction);
			}
		} else if (type.noteCreateAction) {
			noteAction = clientAPI.executeAction(type.noteCreateAction);
		}
		return noteAction.then(() => {
			return updateRefObjects(clientAPI, binding).then(() => {
				return DocumentCreateDelete(clientAPI);
			});
		}).catch(error => {
			Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryServiceRequest.global').getValue(), `update failed: ${error}`);
		});
	}

	static getConfirmationDetailsData(clientAPI, field) {
		const binding = clientAPI.binding;
		const isLocal = CommonLibrary.isCurrentReadLinkLocal(binding['@odata.readLink']);
		const statusPromise = isLocal ? clientAPI.localizeText('open') : WorkOrderEventLibrary.WorkOrdersListViewFormat(clientAPI);
		const isFinal = binding.FinalConfirmation === 'Y';
		let sum = 0.00;
		if (binding) {
			switch (field) {
				case 'Description':
					return ValueIfExists(binding.Description);
				case 'ObjectID':
					return ValueIfExists(binding.ObjectID);
				case 'CreatedBy':
					return ValueIfExists(binding.CreatedBy);
				case 'ContractAccount':
					return ValueIfExists(binding.ContractAccount);
				case 'WarrantyID':
					return ValueIfCondition(`${binding.WarrantyID} ${binding.WarrantyDesc}`, undefined, binding.WarrantyID && binding.WarrantyDesc);
				case 'Status':
					return Promise.resolve(statusPromise).then(status => {
						return isFinal ? clientAPI.localizeText('final_status', [status]) : status;
					});
				case 'NetValue':
					binding.ServiceConfirmationItems_Nav.forEach((val) => {
						if (val.NetValue) {
							sum += Number(val.NetValue);
						}
					});
					sum = `${sum.toFixed(2)} ${binding.ServiceConfirmationItems_Nav[0].Currency}`;
					return sum;
			}
		}
		return '-';
	}

	static getConfirmationDetailsQuery() {
		const select = ['Description', 'FinalConfirmation', 'ObjectID', 'CreatedBy', 'ContractAccount', 'WarrantyID', 'WarrantyDesc',
			'MobileStatus_Nav/MobileStatus', 'ServiceConfirmationItems_Nav/NetValue', 'ServiceConfirmationItems_Nav/Currency'];
		const expand = ['MobileStatus_Nav', 'ServiceConfirmationItems_Nav'];
		return this.getConfirmationItemQueryOptions(select, expand);
	}

	static getConfirmationItemDetailsQuery() {
		const select = ['ProductID', 'ValuationType', 'ProductName', 'ServiceType', 'WarrantyID', 'ServiceProfile',
			'AccountingInd', 'MobileStatus_Nav/MobileStatus', 'ContractAccount', 'Amount', 'Currency', 'NetValue',
			'Quantity', 'QuantityUOM', 'Duration', 'DurationUOM', 'RequestedStart', 'ItemObjectType'];
		const expand = ['MobileStatus_Nav', 'TransHistories_Nav/S4ServiceContractItem_Nav'];
		return this.getConfirmationItemQueryOptions(select, expand);
	}

	static getConfirmationItemQueryOptions(select, expand) {
		return `$select=${select.join(',')}&$expand=${expand.join(',')}`;
	}

	static getConfirmationItemDetailsData(clientAPI, field) {
		const binding = clientAPI.binding;
		if (binding) {
			switch (field) {
				case 'ProductID':
					return ValueIfExists(binding.ProductID);
				case 'ValuationType':
					if (binding.ValuationType) {
						return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', `ServiceValuationTypes('${binding.ValuationType}')`, ['Description'], '').then(result => {
							return result.getItem(0).Description || binding.ValuationType;
						});
					}
					return ValueIfExists(binding.ValuationType);
				case 'ProductName':
					return ValueIfExists(binding.ProductName);
				case 'ServiceType':
					if (binding.ServiceType) {
						return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', `ServiceTypes('${binding.ServiceType}')`, ['ShortDescription'], '').then(result => {
							return result.getItem(0).ShortDescription || binding.ServiceType;
						});
					}
					return ValueIfExists(binding.ServiceType);
				case 'WarrantyID':
					return ValueIfExists(binding.WarrantyID);
				case 'ServiceProfile':
					return ValueIfExists(binding.ServiceProfile);
				case 'AccountingInd':
					return ValueIfExists(binding.AccountingInd);
				case 'Status':
					return WorkOrderEventLibrary.WorkOrdersListViewFormat(clientAPI).then(status => {
						return status;
					});
				case 'ServiceContract':
					return ServiceContractValue(clientAPI);
				case 'ServiceContractItem':
					return ServiceContractItemValue(clientAPI);
				case 'Amount':
					return ValueIfCondition(`${binding.Amount} ${binding.Currency}`, undefined, binding.Amount && binding.Currency);
				case 'NetValue':
					return ValueIfCondition(`${binding.NetValue} ${binding.Currency}`, undefined, binding.NetValue && binding.Currency);
				case 'Quantity':
					return ValueIfCondition(`${binding.Quantity} ${binding.QuantityUOM}`, undefined, binding.Quantity && binding.QuantityUOM);
				case 'Duration':
					return ValueIfCondition(`${binding.Duration} ${binding.DurationUOM}`, undefined, binding.Duration && binding.DurationUOM);
				case 'RequestedStart':
					if (binding.RequestedStart) {
						let startOdataDate = new OffsetODataDate(clientAPI, binding.RequestedStart);
						return clientAPI.formatDate(startOdataDate.date(), '', '', { 'format': 'short' });
					}
					break;
			}
		}
		return '-';
	}

	static getRefObjects(objects) {
		let data = {};

		if (objects && objects.length) {
			objects.forEach(val => {
				if (val.Material_Nav) {
					data.Material = val.Material_Nav;
					data.MaterialObject = val;
				} else if (val.MyEquipment_Nav) {
					data.Equipment = val.MyEquipment_Nav;
					data.EquipmentObject = val;
				} else if (val.MyFunctionalLocation_Nav) {
					data.FunctionalLocation = val.MyFunctionalLocation_Nav;
					data.FunctionalLocationObject = val;
				}
			});
		}

		return data;
	}

	static getRefObjectsIDsFromBinding(binding) {
		const refObjects = binding.RefObjects_Nav || binding.RefObj_Nav;
		let ids = {
			HeaderEquipment: '',
			HeaderFunctionLocation: '',
			Product: '',
		};

		if (CommonLibrary.isDefined(refObjects)) {
			for (let i = 0; i < refObjects.length; i++) {
				if (refObjects[i].EquipID) {
					ids.HeaderEquipment = refObjects[i].EquipID;
				}
				if (refObjects[i].FLocID) {
					ids.HeaderFunctionLocation = refObjects[i].FLocID;
				}
				if (refObjects[i].ProductID) {
					ids.Product = refObjects[i].ProductID;
				}
			}
		}
		return ids;
	}

	static removeEmptyProperties(data) {
		let filteredData = {};
		Object.keys(data).forEach(key => {
			if (data[key] && data[key] !== nilGuid()) {
				filteredData[key] = data[key];
			}
		});
		return filteredData;
	}

	static getHeaderCategorySchemaGuid(context, transactionType = '', stateVariableName = '', catalogType) {
		let schemaGuid;

		if (stateVariableName) {
			schemaGuid = CommonLibrary.getStateVariable(context, stateVariableName);
			if (schemaGuid) return Promise.resolve(schemaGuid);
		}

		return context.read('/SAPAssetManager/Services/AssetManager.service', 'ServiceProcessTypes', ['SubjectProfileAspectGUID', 'CatalogTypeDAspectGUID', 'CatalogTypeCAspectGUID'], `$filter=TransactionType eq '${transactionType}'`).then(result => {
			if (result.length) {
				let property;

				switch (catalogType) {
					case 'C': {
						property = 'CatalogTypeCAspectGUID';
						break;
					}
					case 'D': {
						property = 'CatalogTypeDAspectGUID';
						break;
					}
					default: {
						property = 'SubjectProfileAspectGUID';
					}
				}

				schemaGuid = result.getItem(0)[property];
			}

			if (stateVariableName) {
				CommonLibrary.setStateVariable(context, 'ConfirmationCategorySchemaGuid', schemaGuid);
			}

			return schemaGuid;
		}).catch(error => {
			Logger.error('Read ServiceProcessTypes', error);
			return '';
		});
	}

	static getItemCategorySchemaGuid(context, itemCategory, objectType, headerTransactionType) {
		let schemaGuid;

		return context.read('/SAPAssetManager/Services/AssetManager.service', 'ServiceItemCategorySchemas', ['SubjectProfileAspectGUID'], `$filter=ItemCategory eq '${itemCategory}' and ParentObjectType eq '${objectType}'`).then(result => {
			if (result.length) {
				schemaGuid = result.getItem(0).SubjectProfileAspectGUID;
			}

			if (!schemaGuid || schemaGuid === nilGuid()) {
				return S4ServiceLibrary.getHeaderCategorySchemaGuid(context, headerTransactionType);
			}

			return schemaGuid;
		}).catch(error => {
			Logger.error('Read ServiceItemCategorySchemas', error);
			return '';
		});
	}
}

/**
* On-Change rule for all FDC Filter controls
* Saves control value on previous page's client data
* If clientData.FilterValues does not exist, create it
* @param {IClientAPI} context
*/
export default function MeasuringPointFilterSaveValues(context) {
	const name = context.getName();
	const value = context.getValue();

	const clientData = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous').getClientData();

	if (clientData.FilterValues) {
		clientData.FilterValues[name] = value;
	} else {
		clientData.FilterValues = {[name] : value};
	}
}

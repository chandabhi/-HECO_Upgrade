import {FDCFilterable, FDCSectionHelper} from '../FDC/DynamicPageGenerator';

/**
* Sets up Measuring Points Data Entry Page
* @param {IClientAPI} context
*/
export default function MeasuringPointsDataEntryOnLoaded(context) {
	// Set up Filterable object for the filter control
	let filterable = new FDCFilterable(context);
	context.getClientData().Filterable = filterable;

	let sectionHelper = new FDCSectionHelper(context);

	// Check for existing measurement document and pre-fill fields
	sectionHelper.run(async (sectionBinding, section) => {
		let measurementDoc = await context.read('/SAPAssetManager/Services/AssetManager.service', `${sectionBinding['@odata.readLink']}/MeasurementDocs`, [], '$filter=sap.islocal()&$orderby=ReadingTimestamp desc').then(docs => {
			if (docs.length > 0) {
				return docs.getItem(0);
			} else {
				return null;
			}
		});

		if (measurementDoc) {
			section.getControl('ReadingSim').setValue(measurementDoc.ReadingValue);
			section.getControl('ShortTextNote').setValue(measurementDoc.ShortText);
			// To avoid errors, only set Valuation Code List PIcker if ValuationCode is set (return value must be a readlink)
			if (measurementDoc.ValuationCode)
				section.getControl('ValuationCodeLstPkr').setValue(`PMCatalogCodes(Catalog='${sectionBinding.CatalogType}',CodeGroup='${sectionBinding.CodeGroup}',Code='${measurementDoc.ValuationCode}')`);
			// LAM point -- pre-fill more fields
			if (sectionBinding.PointType === 'L') {
				let controls = [
					'DistanceFromStart',
					'DistanceFromEnd',
					'Offset2',
					'Offset2TypeLstPkr',
					'Offset2UOMLstPkr',
					'Offset1',
					'Offset1TypeLstPkr',
					'Offset1UOMLstPkr',
					'LRPLstPkr',
					'Length',
					'StartPoint',
					'EndPoint',
					'StartMarker',
					'EndMarker',
					'UOM',
					'MarkerUOM',
				];
				controls.forEach(field => section.setControl(field).setValue(sectionBinding[field]));
			}
		}

	});
}

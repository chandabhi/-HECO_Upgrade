import { FDCFilterable, FDCSectionHelper } from '../FDC/DynamicPageGenerator';

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
		/** @type {MeasurementDocument} */
		const measurementDoc = await context.read('/SAPAssetManager/Services/AssetManager.service', `${sectionBinding['@odata.readLink']}/MeasurementDocs`, [], '$filter=sap.islocal()&$expand=LAMObjectDatum_Nav&$orderby=ReadingTimestamp desc').then(docs => {
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
				const lamObjectDatum = measurementDoc.LAMObjectDatum_Nav;
				const LAMObjectDatumFieldNames2Values = !lamObjectDatum ? [] : [
					['LRPLstPkr', lamObjectDatum.LRPId],
					['StartPoint', lamObjectDatum.StartPoint],
					['EndPoint', lamObjectDatum.EndPoint],
					['Length', lamObjectDatum.Length],
					['UOMLstPkr', lamObjectDatum.UOM],
					['StartMarkerLstPkr', lamObjectDatum.StartMarker],
					['DistanceFromStart', lamObjectDatum.StartMarkerDistance],
					['EndMarkerLstPkr', lamObjectDatum.EndMarker],
					['DistanceFromEnd', lamObjectDatum.EndMarkerDistance],
					['MarkerUOMLstPkr', lamObjectDatum.MarkerUOM],
					['Offset1TypeLstPkr', lamObjectDatum.Offset1Type],
					['Offset1', lamObjectDatum.Offset1Value],
					['Offset1UOMLstPkr', lamObjectDatum.Offset1UOM],
					['Offset2TypeLstPkr', lamObjectDatum.Offset2Type],
					['Offset2', lamObjectDatum.Offset2Value],
					['Offset2UOMLstPkr', lamObjectDatum.Offset2UOM],
				];
				[
					...LAMObjectDatumFieldNames2Values,
					['ReadingSim', measurementDoc.ReadingValue],
					['ReadingSim', measurementDoc.RecordedValue],
					['ShortTextNote', measurementDoc.ShortText],
				].forEach(([fieldName, val]) => section.getControl(fieldName).setValue(val));
			}
		}
	});
}

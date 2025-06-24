export default function ZMeasuringPointPrevReadingDisplayValue(pageClientAPI) {

    let binding = pageClientAPI.binding;
    let prevReading = '';

    if (binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        binding = binding.PRTPoint;
    }
    if (binding.MeasuringPoint) {
        binding = binding.MeasuringPoint;
    }

    if (binding.MeasurementDocs.length > 0) {
        //Requerying document select due to reports of incorrect readings being passed
        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'MeasurementDocuments', [], `$filter=Point eq '${binding.Point}'&$orderby=ReadingTimestamp desc&$top=1`).then(function (result) {
            if (result && result.length > 0) {
                let item = result.getItem(0);
                prevReading = item.ReadingValue;
                if (item.ValuationCode != "") {
                    if (prevReading != '') {
                        prevReading = prevReading + ' - ';
                    }
                    return prevReading + item.ValuationCode + ' -  ' + item.CodeShortText;
                }
            }
        });
    }

    return prevReading;
}
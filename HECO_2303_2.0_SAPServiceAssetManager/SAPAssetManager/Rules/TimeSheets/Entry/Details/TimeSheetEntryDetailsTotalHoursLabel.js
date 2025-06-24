import {TimeSheetDetailsLibrary as libTSDetails} from '../../TimeSheetLibrary';
import ConvertDoubleToHourString from '../../../Confirmations/ConvertDoubleToHourString';
import libCrew from '../../../Crew/CrewLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';

export default function TimeSheetEntryDetailsTotalHoursLabel(pageClientAPI) {
    let timePromise;

    if (userFeaturesLib.isFeatureEnabled(pageClientAPI, pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        timePromise = libCrew.getTotalHoursWithDateForCurrentCrew(pageClientAPI, pageClientAPI.binding.Date);
    } else {
        timePromise = libTSDetails.TimeSheetEntryDetailsTotalHours(pageClientAPI);
    }

    return timePromise.then(function(hours) {
        return pageClientAPI.localizeText('x_hours', [ConvertDoubleToHourString(hours)]);
    }); 
}

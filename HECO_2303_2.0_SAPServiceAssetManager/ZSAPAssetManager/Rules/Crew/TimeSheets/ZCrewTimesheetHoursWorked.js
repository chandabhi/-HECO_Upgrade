import { TimeSheetLibrary as libTimesheet } from '../../TimeSheets/TimeSheetLibrary';
import {ValueIfExists} from '../../../../SAPAssetManager/Rules/Common/Library/Formatter';
import ConvertDoubleToHourString from '../../../../SAPAssetManager/Rules/Confirmations/ConvertDoubleToHourString';

export default function ZCrewTimesheetHoursWorked(context) {
    let catTimeSheets = context.binding.Employee.CatsTimesheet;
    let hoursCount;
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/CrewList', [], '').then(function(result) {
        catTimeSheets.forEach(function(element) {
            if (element.ZWageType == "" && element.Date === result.getItem(0).OriginTimeStamp) {
                if (!hoursCount) {
                    hoursCount = 0;   
                }
                hoursCount += libTimesheet.getActualHours(context, element.Hours);
            }
        });
        if (hoursCount) {
            return ConvertDoubleToHourString(hoursCount);   
        } else {
            return ValueIfExists(hoursCount);
        }
    });
    
}

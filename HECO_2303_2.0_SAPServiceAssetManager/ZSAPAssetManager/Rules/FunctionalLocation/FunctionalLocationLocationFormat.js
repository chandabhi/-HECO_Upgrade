import GetLocationInformation from '../Common/GetLocationInformation';
import {ValueIfExists} from '../Common/Library/Formatter';
import libCommon from '../Common/Library/CommonLibrary';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import {formatLocationInfo} from '../Common/GetLocationInformation';

export default function FunctionalLocationLocationFormat(context) {
    return GetLocationInformation(context).then(oInfo => {
        let value = oInfo;
        if (oInfo && typeof oInfo === 'object' && 'geometryType' in oInfo && 'geometryValue' in oInfo) {
            value = formatLocationInfo(context, oInfo);
            libCommon.setStateVariable(context, 'GeometryObjectType', 'FunctionalLocation');
            ApplicationSettings.setString(context, 'Geometry', JSON.stringify(oInfo));
        }

        return ValueIfExists(value, context.localizeText('no_location_available'));
    });
}

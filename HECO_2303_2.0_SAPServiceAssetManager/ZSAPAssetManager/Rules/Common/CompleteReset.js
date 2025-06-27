import libCom from './Library/CommonLibrary';
import personalLib from '../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import userFeaturesLib from '../../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';
import locationLib from '../../../SAPAssetManager/Rules/LocationTracking/LocationTrackingLibrary';
import ApplicationSettings from './../../../SAPAssetManager/Rules/Common/Library/ApplicationSettings';
import errorLib from './../../../SAPAssetManager/Rules/Common/Library/ErrorLibrary';

export default function CompleteReset(clientAPI)
{
    if (personalLib.isMaintenanceTechnician(clientAPI))
    {
        let pageProxy = clientAPI.evaluateTargetPathForAPI('#Page:OverviewPage');
        //Omni: Disable standard overview map reset
        // let sectionedTable = pageProxy.getControls()[0]; 
        // if (libCom.isDefined(sectionedTable)) {
        //     let mapSection = sectionedTable.getSections()[0];
        //     if (libCom.isDefined(mapSection)) {
        //         let mapViewExtension = mapSection.getExtensions()[0];
        //         if (libCom.isDefined(mapViewExtension)) {
        //             mapViewExtension.clearUserDefaults();
        //         }
        //     }
        // }
    }
    // Changing the flag back to false to execute Update action again on subsequent reset
    userFeaturesLib.diableAllFeatureFlags(clientAPI);
    ApplicationSettings.setBoolean(clientAPI, 'didSetUserGeneralInfos', false);
    ApplicationSettings.setBoolean(clientAPI, 'initialSync', true);

    // Disable service and rsset user switch for location tracking feature
    locationLib.disableService(clientAPI);
    locationLib.setUserSwitch(clientAPI, '');

    // Clear error messages
    errorLib.clearError(clientAPI);
}

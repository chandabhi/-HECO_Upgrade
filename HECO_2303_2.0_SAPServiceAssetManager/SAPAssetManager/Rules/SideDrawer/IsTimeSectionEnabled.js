import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';
import TimeSheetsIsEnabled from '../TimeSheets/TimeSheetsIsEnabled';
import personalLib from '../Persona/PersonaLibrary';

export default function IsTimeSectionEnabled(context) {
    // Check if either the time sheet or labor time is enabled AND MT is enabled
    return personalLib.isMaintenanceTechnician(context) && (ConfirmationsIsEnabled(context) || TimeSheetsIsEnabled(context));
}

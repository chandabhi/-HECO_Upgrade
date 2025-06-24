import SOControlsLib from '../S4ServiceOrderControlsLibrary';
import SRControlsLib from '../S4ServiceRequestControlsLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function EquipIDValue(context) {
    if (libCommon.getPageName(context) === 'ServiceRequestCreateUpdatePage') {
        return SRControlsLib.getEquipmentValue(context);
    }
    return SOControlsLib.getEquipmentValue(context);
}

import SOControlsLib from '../S4ServiceOrderControlsLibrary';
import SRControlsLib from '../S4ServiceRequestControlsLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function FuncLocIDValue(context) {
    if (libCommon.getPageName(context) === 'ServiceRequestCreateUpdatePage') {
        return SRControlsLib.getFunctionalLocationValue(context);
    }
    return SOControlsLib.getFunctionalLocationValue(context);
}

import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from './IsS4ServiceIntegrationEnabled';

export default function IsServiceItemKPIVisible(context) {
    if (IsS4ServiceIntegrationEnabled(context)) {
        return MobileStatusLibrary.isServiceItemStatusChangeable(context);
    } else {
        return MobileStatusLibrary.isOperationStatusChangeable(context);
    }
}

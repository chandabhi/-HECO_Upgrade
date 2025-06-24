import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from './IsS4ServiceIntegrationEnabled';

export default function IsServiceOrderKPIVisible(context) {
    if (IsS4ServiceIntegrationEnabled(context)) {
        return MobileStatusLibrary.isServiceOrderStatusChangeable(context);
    } else {
        return MobileStatusLibrary.isHeaderStatusChangeable(context);
    }
}

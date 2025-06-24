import libCommon from '../../Common/Library/CommonLibrary';
import enableMaintenanceTechnician from '../../SideDrawer/EnableMaintenanceTechnician';
import enableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function IsOperationLevelAssigmentType(context) {
     if (enableMaintenanceTechnician(context) || (enableFieldServiceTechnician(context) && !IsS4ServiceIntegrationEnabled(context))) {
          return (libCommon.getWorkOrderAssnTypeLevel(context) === 'Operation');
     }
     return false;
}

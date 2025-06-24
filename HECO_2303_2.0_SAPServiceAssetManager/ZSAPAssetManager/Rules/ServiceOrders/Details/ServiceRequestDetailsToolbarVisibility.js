import pageToolbar from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import ServiceOrderEnableMobileStatus from '../Status/ServiceOrderEnableMobileStatus';

export default function ServiceRequestDetailsToolbarVisibility(context) {
    return ServiceOrderEnableMobileStatus(context).then(visible => {
        return visible && CommonLibrary.isDefined(pageToolbar.getInstance().getToolbarItems(context));
    });
}

import pageToolbar from '../../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import libCommon from '../../../Common/Library/CommonLibrary';

export default function ServiceItemDetailsToolbarVisibility(context) {
    //We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
    let isLocal = libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (isLocal) {
        if (!libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects')) {
            return Promise.resolve(false);
        }
    }

    return Promise.resolve(libCommon.isDefined(pageToolbar.getInstance().getToolbarItems(context)));
}

import GeometryDelete from '../../Geometries/GeometryDelete';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function NotificationDeleteGeometry(context) {
    return context.executeAction('/SAPAssetManager/Actions/DiscardWarningMessage.action').then( result => {
        if (result.data === true) {
            return GeometryDelete(context, 'Geometry_Nav', 'Geometries').then(() => {
                return GeometryDelete(context, 'NotifGeometries', 'MyNotifGeometries').then(() => {
                    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessageNoClosePage.action');
                }).catch(() => {
                    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action');
                });
            }).catch(() => {
                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action');
            });
        }
        return Promise.resolve();
    });
}

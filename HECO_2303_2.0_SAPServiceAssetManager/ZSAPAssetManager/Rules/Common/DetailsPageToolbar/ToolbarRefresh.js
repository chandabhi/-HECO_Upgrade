import Logger from '../../Log/Logger';
import pageToolbar from './DetailsPageToolbarClass';
import ToolbarGetStatusOptions from './ToolbarGetStatusOptions';

export default function ToolbarRefresh(context) {
    let getStatusOptionsPromise = ToolbarGetStatusOptions(context);

    return getStatusOptionsPromise.then(items => {
        return pageToolbar.getInstance().generatePossibleToolbarItems(context, items).then(() => {
            if (context.currentPage && context.currentPage.isModal()) {
                context.evaluateTargetPathForAPI('#Page:-Previous').getToolbar().getToolbarControls().forEach(tbi => tbi.redraw());
                context.evaluateTargetPathForAPI('#Page:-Previous').getToolbar().redraw();
                return Promise.resolve();
            }
            context.getToolbar().getToolbarControls().forEach(tbi => tbi.redraw());
            context.getToolbar().redraw();
            return Promise.resolve();
        })
        .catch(error => {
            Logger.error('Toolbar update', error);
            return Promise.resolve();
        });
    });
}

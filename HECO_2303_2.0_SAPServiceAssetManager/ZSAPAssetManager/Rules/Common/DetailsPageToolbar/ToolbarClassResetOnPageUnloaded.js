import pageToolbar from './DetailsPageToolbarClass';

export default function ToolbarClassResetOnPageUnloaded(context) {
    return pageToolbar.resetToolbarItems(context);
}

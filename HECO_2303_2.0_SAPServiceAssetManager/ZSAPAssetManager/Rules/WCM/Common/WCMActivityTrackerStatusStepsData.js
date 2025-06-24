import WCMDocumentItemActivityTrackerStepsData from '../OperationalItems/Details/WCMDocumentItemActivityTrackerStepsData';
import WCMActivityTrackerSysStatusStepsData from './WCMActivityTrackerSysStatusStepsData';

export const ProgressStates = Object.freeze({
    notVisited: 0,
    visitedButNotCompleted: 1,
    completed: 2,
    error: 3,
    disabled: 4,
});

export default function WCMActivityTrackerStatusStepsData(context) {
    const bindingType = context && context.binding && context.binding['@odata.type'];
    if (!bindingType) {
        return [];
    }
    switch (bindingType) {
        case '#sap_mobile.WCMDocumentItem':
            return WCMDocumentItemActivityTrackerStepsData(context);
        case '#sap_mobile.WCMDocumentHeader':
            return WCMActivityTrackerSysStatusStepsData(context, "WCMDocumentItem eq '000000'");
        default:
            return WCMActivityTrackerSysStatusStepsData(context);
    }
}

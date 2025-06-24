import { GetWCMDocItemMobileStatusLabel } from './OperationalItemMobileStatusTextOrEmpty';
import { CreateTimelineStep } from '../../Common/WCMActivityTrackerSysStatusStepsData';
import libVal from '../../../Common/Library/ValidationLibrary';
import { ProgressStates } from '../../Common/WCMActivityTrackerStatusStepsData';



export default function WCMDocumentItemActivityTrackerStepsData(context) {
    return GetMobileStatusWithHistories(context, context.binding)
        .then(pmMobileStatus => pmMobileStatus ? Promise.all([
            ...pmMobileStatus.PMMobileStatusHistory_Nav.map(pmMobileStatusHistory => ConvertMobileStatusToTimelineStep(context, pmMobileStatusHistory, ProgressStates.completed)),
            ConvertMobileStatusToTimelineStep(context, pmMobileStatus, ProgressStates.visitedButNotCompleted),
        ]) : [])
        .then(steps => ({ SelectedStepIndex: steps.length - 1, Steps: steps }));
}

function GetMobileStatusWithHistories(context, wcmDocumentItem) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${wcmDocumentItem['@odata.readLink']}/PMMobileStatus`, [], '$expand=PMMobileStatusHistory_Nav($orderby=EffectiveTimestamp asc)')
        .then(pmMobileStatus => libVal.evalIsEmpty(pmMobileStatus) ? null : pmMobileStatus.getItem(0));
}

function ConvertMobileStatusToTimelineStep(context, pmMobileStatus, state) {
    return GetWCMDocItemMobileStatusLabel(context, pmMobileStatus.MobileStatus)
        .then(title => CreateTimelineStep(context, state, title, pmMobileStatus.EffectiveTimestamp, undefined));
}


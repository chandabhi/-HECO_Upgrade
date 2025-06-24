import CommonLibrary from '../../Common/Library/CommonLibrary';
import ProgressTrackerOnDataChanged from '../../TimelineControl/ProgressTrackerOnDataChanged';
import Caption from './Details/Caption';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';


export const OperationalCycleSpec = Object.freeze({
    TaggingCycleWithTemporaryUntaggingPhase: '',
    TestCycle: '1',
    TaggingCycleWithoutTemporaryUntaggingPhase: '2',
    NoItems: 'X',
});

export const OpItemMobileStatusCodes = Object.freeze({
    Tag: 'TAG',  // TAG
    TagPrinted: 'TAGPRINT',  // PTAG
    InitialTaggingStatus: 'INITIALTAG',  // ITG
    Untag: 'UNTAG',  // BUG
    Tagged: 'TAGGED',  // ETG
    UnTagged: 'UNTAGGED',
    UntagTemporarily: 'UNTAGT', //BTUG
    TestTagPrinted: 'TAGPRINTT', //PTST
});

const StatusesForUntaggingCondition = Object.freeze([OpItemMobileStatusCodes.Tagged, OpItemMobileStatusCodes.UntagTemporarily, OpItemMobileStatusCodes.TestTagPrinted, OpItemMobileStatusCodes.Untag]);

function HasMobileStatus(operationalItem, mobileStatus) {
    return (operationalItem.PMMobileStatus && operationalItem.PMMobileStatus.MobileStatus) === mobileStatus;
}

function IsPrintTagChecked(operationalItem) {
    return operationalItem.WCMDocumentHeaders.WCMDocumentUsages.PrintTag === 'X';
}

function IsTagChecked(operationalItem) {
    return operationalItem.WCMDocumentHeaders.WCMDocumentUsages.Tag === 'X';
}

export async function IsTaggingActive(context, operationalItem) {
    const [tagPrintedStatus, initialTaggingStatus, tagStatus, printTagChecked, tagChecked, isDownlineSeqChecked] = [
        HasMobileStatus(operationalItem, OpItemMobileStatusCodes.TagPrinted),
        HasMobileStatus(operationalItem, OpItemMobileStatusCodes.InitialTaggingStatus),
        HasMobileStatus(operationalItem, OpItemMobileStatusCodes.Tag),
        IsPrintTagChecked(operationalItem),
        IsTagChecked(operationalItem),
        CheckDownlineSequenceAllowsChangeStatus(context, operationalItem, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TaggedParameterName.global').getValue(), +operationalItem.TagSequence),
    ];
    if (await isDownlineSeqChecked) {
        return (tagPrintedStatus && !printTagChecked) || (initialTaggingStatus && tagChecked && printTagChecked) || (tagStatus && !tagChecked && printTagChecked);
    }

    return false;
}

function IsUntagChecked(operationalItem) {
    return operationalItem.WCMDocumentHeaders.WCMDocumentUsages.Untag === 'X';
}

function IsAllRelatedWorkPermitClosed(context, operationalItem) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${operationalItem['@odata.readLink']}/WCMDocumentHeaders/WCMApplicationDocuments`, [], '$expand=WCMApplications')
        .then(wcmApplicationDocuments => Array.from(wcmApplicationDocuments, wcmApplicationDocument => wcmApplicationDocument.WCMApplications))
        .then(wcmApplications => {
            const closedStatus = context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Closed.global').getValue();
            return wcmApplications.every(wcmApplication => wcmApplication.ActualSystemStatus === closedStatus);
        });
}

export async function IsUntaggingActive(context, operationalItem) {
    const [untagStatus, taggedStatus, untagChecked, isAllRelatedWorkPermitClosed, isDownlineSeqChecked] = [
        HasMobileStatus(operationalItem, OpItemMobileStatusCodes.Untag),
        HasMobileStatus(operationalItem, OpItemMobileStatusCodes.Tagged),
        IsUntagChecked(operationalItem),
        IsAllRelatedWorkPermitClosed(context, operationalItem),
        CheckDownlineSequenceAllowsChangeStatus(context, operationalItem, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/UntaggedParameterName.global').getValue(), +operationalItem.UntSequence),
    ];

    if (await isDownlineSeqChecked) {
        return (untagStatus && !untagChecked) || (taggedStatus && untagChecked && await isAllRelatedWorkPermitClosed);
    }

    return false;
}

export function CheckDownlineSequenceAllowsChangeStatus(context, operationalItem, status, currentSeqNumber) {
    //no need to check for lowest sequence
    if (!currentSeqNumber) {
        return Promise.resolve(true);
    }

    const isTaggedStatus = status === context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TaggedParameterName.global').getValue();
    const seqProperty = isTaggedStatus ? 'TagSequence' : 'UntSequence';
    const downlineSeqString = String(currentSeqNumber - 1);
    const downlineSeqStringFull = '00000'.slice(0, -downlineSeqString.length) + downlineSeqString;
    const query = `$expand=PMMobileStatus&$filter=${seqProperty} eq '${downlineSeqStringFull}'`;

    return context.read('/SAPAssetManager/Services/AssetManager.service', `${operationalItem['@odata.readLink']}/WCMDocumentHeaders/WCMDocumentItems`, [], query).then(data => {
        if (ValidationLibrary.evalIsEmpty(data)) {
            //check next downline sequence if no operational items
            return CheckDownlineSequenceAllowsChangeStatus(context, operationalItem, status, +downlineSeqString);
        }

        return Promise.resolve(!data.some(item => item.PMMobileStatus.MobileStatus !== status));
    });
}

function GetQueryOptionsForPrevNextItem(binding, next = true) {
    return `$orderby=Sequence ${next ? 'asc' : 'desc'}&$filter=Sequence ${next ? 'gt' : 'lt'} '${binding.Sequence}'`;
}

export function IsPrevNextButtonEnabled(context, next = true) {
    const binding = context.binding;
    const query = GetQueryOptionsForPrevNextItem(binding, next);
    return CommonLibrary.getEntitySetCount(context, `${binding['@odata.readLink']}/WCMDocumentHeaders/WCMDocumentItems`, query)
        .then(count => !!count);
}

export function PrevNextItemButtonOnPress(context, next = true) {
    const toolbarControls = context.getToolbarControls();
    const switchBtn = toolbarControls.find(item => item.name === (next ? 'NextItem' : 'PreviousItem'));
    if (!switchBtn.enabled) {
        return false;
    }

    context.showActivityIndicator();
    const binding = context.binding;
    return GetAndUpdateOperationalItem(context, `${binding['@odata.readLink']}/WCMDocumentHeaders/WCMDocumentItems`, GetQueryOptionsForPrevNextItem(binding, next), next);
}

export function GetAndUpdateOperationalItem(context, entitySet, query = '', next) {
    const queryOptions = `${query}${query ? '&' : ''}$expand=WCMDocumentHeaders,WCMOpGroup_Nav,PMMobileStatus`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(result => {
        const toolbarControls = context.getToolbarControls();

        // manually disable/enable prev/next button after switching
        const prevToolbarBtn = toolbarControls.find(item => item.name === 'PreviousItem');
        const nextToolbarBtn = toolbarControls.find(item => item.name === 'NextItem');
        prevToolbarBtn.setEnabled(result.length === 1 ? next : true);
        nextToolbarBtn.setEnabled(result.length === 1 ? !next : true);

        const pageProxy = context.getPageProxy();
        const sectionedTable = pageProxy.getControl('SectionedTable');
        const toolbar = pageProxy.getToolbar();

        // rewrite binding in current context, page level, sectioned table, toolbar, toolbar items and progress tracker extension
        context._context.binding = result.getItem(0);
        pageProxy._context.binding = context._context.binding;
        sectionedTable._context.binding = pageProxy._context.binding;
        toolbar._context.binding = pageProxy._context.binding;
        toolbarControls.forEach(item => {
            if (item.context._clientAPI) {
                item.context._clientAPI._context.binding = pageProxy._context.binding;
            }
        });
        sectionedTable.getControl('ProgressTrackerExtensionControl')._control._extension.controlProxy._context.binding = pageProxy._context.binding;

        // manually redraw set tagged/untagged button after switching
        toolbarControls.find(item => item.name === 'SetTaggedUntagged').redraw();
        return Promise.resolve(sectionedTable.redraw()).then(async () => {
            ProgressTrackerOnDataChanged(context);
            pageProxy.setCaption(await Caption(context));
            context.dismissActivityIndicator();
        });
    });
}

export function IsOperationalItemInUntagging(context) {
    const binding = context.binding;
    return (ValidationLibrary.evalIsEmpty(binding.PMMobileStatus) ? context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/PMMobileStatus`, [], '').then(result => result.getItem(0)) : Promise.resolve(binding.PMMobileStatus)).then(status => {
        if (ValidationLibrary.evalIsEmpty(status)) {
            return false;
        }
        return StatusesForUntaggingCondition.includes(status.MobileStatus);
    });
}

export function GetOperationalItemTechObjectId(context, wcmDocumentItem) {
    if (wcmDocumentItem.ItemCategory === 'E') {
        return Promise.resolve(wcmDocumentItem.Equipment);
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${wcmDocumentItem['@odata.readLink']}/MyFunctionalLocations`, ['FuncLocId'], '')
        .then(floc => ValidationLibrary.evalIsEmpty(floc) ? '' : floc.getItem(0).FuncLocId);
}

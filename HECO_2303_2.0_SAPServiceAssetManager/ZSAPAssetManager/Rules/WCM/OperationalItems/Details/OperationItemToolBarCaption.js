import { IsTaggingActive, IsUntaggingActive, OperationalCycleSpec } from '../libWCMDocumentItem';

export const TagStates = Object.freeze({
    None: 1,
    SetTagged: 2,
    SetUntagged: 3,
});

export default async function OperationItemToolBarCaption(context, wcmDocumentItem = undefined) {
    const taggingState = await CalculateActiveTagButton(context, wcmDocumentItem);
    context.binding.taggingState = taggingState;  // "cache" this for use in tagging modal navigation
    switch (taggingState) {
        case TagStates.SetTagged:
            return context.localizeText('set_tagged');
        case TagStates.SetUntagged:
            return context.localizeText('set_untagged');
        default:
            return '';
    }
}

export async function CalculateActiveTagButton(context, wcmDocumentItem = undefined) {
    const binding = await ExpandOperationalItem(context, wcmDocumentItem || context.binding);

    if (binding.WCMDocumentHeaders.WCMDocumentUsages.Specification !== OperationalCycleSpec.TaggingCycleWithoutTemporaryUntaggingPhase) {
        return TagStates.None;
    }
    if (await IsTaggingActive(context, binding)) {
        return TagStates.SetTagged;
    }
    if (await IsUntaggingActive(context, binding)) {
        return TagStates.SetUntagged;
    }
    return TagStates.None;
}

function ExpandOperationalItem(context, wcmDocumentItem) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', wcmDocumentItem['@odata.readLink'], [], '$expand=WCMDocumentHeaders($expand=WCMDocumentUsages),PMMobileStatus').then(value => value.getItem(0));
}

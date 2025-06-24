import { GetMobileStatusLabelOrEmpty } from './MobileStatusUntagText';

export default function MobileStatusTagPrintedText(context) {
    return GetMobileStatusLabelOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TagPrintedParameterName.global').getValue());
}

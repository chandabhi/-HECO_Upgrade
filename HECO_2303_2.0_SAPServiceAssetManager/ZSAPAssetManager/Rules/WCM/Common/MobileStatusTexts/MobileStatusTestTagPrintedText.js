import { GetMobileStatusLabelOrEmpty } from './MobileStatusUntagText';

export default function MobileStatusTestTagPrintedText(context) {
    return GetMobileStatusLabelOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TestTagPrintedParameterName.global').getValue());
}

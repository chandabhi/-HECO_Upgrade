import common from '../../../Common/Library/CommonLibrary';

export default function PhaseControlCodesQueryOptions(context) {
    let orderTypeFilter = context.getPageProxy().evaluateTargetPath('#Control:OrderTypeFilter/#Value').map(element => element.ReturnValue);
    return `$filter=Entity eq '${common.getAppParam(context, 'OBJECTTYPE','Operation')}' and (${orderTypeFilter.join(' or ')})`;
}

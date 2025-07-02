import { GlobalVar } from "../../../../../SAPAssetManager/Rules/Common/Library/GlobalCommon"

export default function ZNotificationActivityCreateUpdateLocationQuery(context) {
    
    return `$filter=Plant eq '${GlobalVar.getUserSystemInfo().get('USER_PARAM.IWK')}'&$orderby=Location`
}

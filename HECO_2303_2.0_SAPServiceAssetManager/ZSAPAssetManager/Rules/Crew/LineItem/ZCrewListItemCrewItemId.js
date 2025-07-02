import generateGUID from "../../../../SAPAssetManager/Rules/Common/guid";

export default function ZCrewListItemCrewItemId(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return generateGUID();
}

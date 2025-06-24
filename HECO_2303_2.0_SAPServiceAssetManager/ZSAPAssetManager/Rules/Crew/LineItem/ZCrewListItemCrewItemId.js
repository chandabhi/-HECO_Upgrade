import generateGUID from "../../Common/guid";

export default function ZCrewListItemCrewItemId(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return generateGUID();
}

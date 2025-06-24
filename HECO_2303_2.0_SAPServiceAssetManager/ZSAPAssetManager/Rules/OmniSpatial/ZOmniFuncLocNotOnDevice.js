import libCommon from '../Common/Library/CommonLibrary';


export default function ZOmniFuncLocNotOnDevice(context, bindingParams) {
    //The map will show far more objects than have been downloaded to a user's device
    //If Functional Location is not present, need to hide normal controls and skip linkage
    return (libCommon.getStateVariable(context, 'OmniSelectedFuncLoc') != undefined);
}

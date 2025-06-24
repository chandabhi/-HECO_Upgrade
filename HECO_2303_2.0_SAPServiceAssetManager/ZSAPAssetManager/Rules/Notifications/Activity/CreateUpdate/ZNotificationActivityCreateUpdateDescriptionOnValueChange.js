
export default function ZNotificationActivityCreateUpdateDescriptionOnValueChange(context) {
    //HECO
    //Copies dropdown value to the Activity Description
    let devLocNote = context.getValue()[0].ReturnValue; //Returns the value for the object that triggered this function
    let description = context.getPageProxy().evaluateTargetPathForAPI('#Control:DescriptionTitle');
    description.setValue(devLocNote);
}

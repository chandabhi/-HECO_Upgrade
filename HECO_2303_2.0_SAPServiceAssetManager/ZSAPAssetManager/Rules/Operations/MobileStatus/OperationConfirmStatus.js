import libOpMobile from './OperationMobileStatusLibrary';

/**
* Confirm operation from details page
* @param {IClientAPI} context
*/
export default function OperationConfirmStatus(context) {
    return libOpMobile.completeOperation(context);
}

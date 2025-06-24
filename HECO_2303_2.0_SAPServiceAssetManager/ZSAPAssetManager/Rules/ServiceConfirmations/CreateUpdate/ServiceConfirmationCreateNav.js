import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';

export default function ServiceConfirmationCreateNav(context) {
    ServiceConfirmationLibrary.getInstance().resetAllFlags();
    return ServiceConfirmationLibrary.getInstance().openStartPage(context);
}

import ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function ServiceRequestSoldToPartyReadLink(context) {
    const soldToPartyValue = ServiceRequestControlsLibrary.getSoldToParty(context);
    return `S4BusinessPartners('${soldToPartyValue}')`;
}

import { PartnerFunction } from '../../Common/Library/PartnerFunction';

export default function ServiceDetailsSoldToPartyQueryOptions() {
    return `$filter=PartnerFunction eq '${PartnerFunction.getSoldToPartyPartnerFunction()}'&$expand=Address_Nav,Address_Nav/AddressCommunication,PartnerFunction_Nav,Employee_Nav`;
}

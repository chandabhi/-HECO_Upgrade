import libCom from '../../Common/Library/CommonLibrary';
import { ValueIfExists } from '../../Common/Library/Formatter';

export default function ServiceContractValue(context) {
    let binding = context.getBindingObject();
    let pageName = libCom.getPageName(context);

    if (pageName === 'ServiceOrderDetailsPage' && binding.TransHistories_Nav.length && libCom.isDefined(binding.TransHistories_Nav[0].S4ServiceContract_Nav)) {
        const serviceContract = binding.TransHistories_Nav[0].S4ServiceContract_Nav;
        return `${serviceContract.ObjectID} - ${serviceContract.Description}`;
    }

    if (pageName === 'ServiceItemDetailsPage' && binding.TransHistories_Nav.length && libCom.isDefined(binding.TransHistories_Nav[0].S4ServiceContractItem_Nav) && libCom.isDefined(binding.TransHistories_Nav[0].S4ServiceContractItem_Nav.Contract_Nav)) {
        const serviceContract = binding.TransHistories_Nav[0].S4ServiceContractItem_Nav.Contract_Nav;
        return `${serviceContract.ObjectID} - ${serviceContract.Description}`;
    }
    return ValueIfExists(binding.ContractAccount);
}

import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/IssueAllWrapper';

export default function SetProductionOrderComponentsGoodsIssueIssueAll(context) {
    libCom.setStateVariable(context, 'IMObjectType', 'PRD');
    libCom.setStateVariable(context, 'IMMovementType', 'I');
    return wrapper(context);
}

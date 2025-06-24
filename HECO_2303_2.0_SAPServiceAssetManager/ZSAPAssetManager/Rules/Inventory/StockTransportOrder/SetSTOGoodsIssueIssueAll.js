import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/IssueAllWrapper';

export default function SetSTOGoodsIssueIssueAll(context) {
    libCom.setStateVariable(context,'IMObjectType','STO');
    libCom.setStateVariable(context, 'IMMovementType', 'I');
    return wrapper(context);
}

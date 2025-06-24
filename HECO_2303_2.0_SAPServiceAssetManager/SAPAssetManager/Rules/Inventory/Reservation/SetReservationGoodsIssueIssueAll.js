import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/IssueAllWrapper';

export default function SetReservationGoodsIssueIssueAll(context) {
    libCom.setStateVariable(context, 'IMObjectType', 'RES');
    libCom.setStateVariable(context, 'IMMovementType', 'I');
    return wrapper(context);
}

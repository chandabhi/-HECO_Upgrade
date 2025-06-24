import libCom from '../../../Common/Library/CommonLibrary';

export default function WorkApprovalsListViewFormat(context) {
    var section = context.getName();
    var property = context.getProperty();
    var binding = context.binding;
    var value = '';

    switch (section) {
        case 'WorkApprovals':
            switch (property) {
                case 'Footnote':
                    if (binding.Equipment) {
                        value = libCom.getEntityProperty(context, `MyEquipments('${binding.Equipment}')`, 'EquipDesc').then(EquipDesc => {
                            return EquipDesc;
                        });
                    } else if (binding.FuncLoc) {
                        value = libCom.getEntityProperty(context, `MyFunctionalLocations('${binding.FuncLoc}')`, 'FuncLocDesc').then(FuncLocDesc => {
                            return FuncLocDesc;
                        });
                    }
                    break;
                case 'StatusText':
                    value = libCom.getEntityProperty(context, `WCMApprovals('${binding.WCMApproval}')`, 'ActualSystemStatus').then(statusNumber => {
                        return libCom.getEntityProperty(context, `SystemStatuses('${statusNumber}')`, 'StatusText').then(statusText=>{
                            return statusText;
                        });
                    });
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return value;
}

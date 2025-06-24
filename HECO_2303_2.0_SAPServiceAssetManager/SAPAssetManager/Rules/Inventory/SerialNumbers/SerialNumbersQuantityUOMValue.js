import libCom from '../../Common/Library/CommonLibrary';

export default function QuantityUom(context) {
    const target = libCom.getStateVariable(context, 'SerialPageBinding');
    const quantity = libCom.getStateVariable(context, 'OpenQuantity') || 0;
    const uom = target.UOM;

    return quantity + ' ' + uom;
}

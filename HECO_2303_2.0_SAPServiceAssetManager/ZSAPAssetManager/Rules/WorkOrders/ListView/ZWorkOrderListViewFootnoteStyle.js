
export default function ZWorkOrderListViewFootnoteStyle(context) {

    let binding = context.getBindingObject();

    //HECO CIS orders with life support or hostile customers will be marked with red footnotes
    if (binding.ZWorkCustomerAlertNotes) {
        let notes = binding.ZWorkCustomerAlertNotes.toLowerCase();
        if( (notes.indexOf("life") != -1) || (notes.indexOf("host") != -1))  {
            return 'ObjectCellStyleRed';
        }
    }
    return 'FootnotePrimary';
}


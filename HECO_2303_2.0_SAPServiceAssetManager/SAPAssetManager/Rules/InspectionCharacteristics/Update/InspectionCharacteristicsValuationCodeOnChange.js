import {FDCSectionHelper} from '../../FDC/DynamicPageGenerator';

export default function InspectionCharacteristicsValuationCodeOnChange(context) {
    let fdcHelper = new FDCSectionHelper(context);
    let section = fdcHelper.findSection(context);
    if (section && Object.prototype.hasOwnProperty.call(section,'index') && section.index !== -1) {
        let index = section.index;
        let binding = section.binding;
        let valCtrl = context.getPageProxy().getControls()[0].sections[index].getControl('Valuation');
        switch (binding.Valuation) {
            case 'A':
                valCtrl.setStyle('AcceptedGreen','Value');
                break;
            case 'R':
            case 'F':
                valCtrl.setStyle('RejectedRed','Value');
                break;
            default:
                valCtrl.setStyle('GrayText','Value');
        }
        context.getPageProxy().getControl('FormCellContainer').redraw();
        context.clearValidation();
    }
}


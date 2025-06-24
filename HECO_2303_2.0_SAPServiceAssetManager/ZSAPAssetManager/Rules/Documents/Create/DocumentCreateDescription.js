
export default function DocumentCreateDescription(context) {
    if (context.getPageProxy().getControls().some(controls => controls.getName() === 'PDFExtensionControl')) {
        return 'Service Report';
    } else { 
        let description;
        try {
            description = context.getPageProxy().evaluateTargetPath('#Control:AttachmentDescription/#Value');
        } catch (err) {
            description = '-';
        }
        return description;
    }
}

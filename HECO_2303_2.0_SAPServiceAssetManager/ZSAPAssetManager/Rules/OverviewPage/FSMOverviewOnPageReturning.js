import libPersona from '../Persona/PersonaLibrary';

export default function FSMOverviewOnPageReturning(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        let sectionedTable = context.getControls()[0];
        let mapSection = sectionedTable.getSection('MapExtensionSection');

        if (mapSection && mapSection.getVisible() !== false) {
            let mapViewExtension = mapSection.getExtensions()[0];
            mapViewExtension.update();
        }

        let s4MapSection = sectionedTable.getSection('S4MapExtensionSection');
        if (s4MapSection && s4MapSection.getVisible() !== false) {
            let mapViewExtension = s4MapSection.getExtensions()[0];
            mapViewExtension.update();
        }
    }
}

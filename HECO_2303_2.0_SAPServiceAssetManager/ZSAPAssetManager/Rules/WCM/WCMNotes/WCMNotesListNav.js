import WCMNotesLibrary from './WCMNotesLibrary';

export default function WCMNotesListNav(context) {
    const page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/WCM/WCMNotes/WCMNotesList.page');
    page.Controls[0].Sections.forEach(section => {
        section.Target.QueryOptions = WCMNotesLibrary.getNoteQueryOptions(context, section._Name);
    });
    
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/WCMNotes/WCMNotesListNav.action',
        'Properties': {
            'PageMetadata': page,
        },
    });
}

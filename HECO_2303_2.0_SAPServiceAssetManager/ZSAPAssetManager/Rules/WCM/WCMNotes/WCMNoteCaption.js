import WCMNotesLibrary from './WCMNotesLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WCMNoteCaption(context) {
    const currentPageName = CommonLibrary.getPageName(context);
    const textType = currentPageName === 'WCMNoteDetailsPage' ? context.binding.TextType : undefined;
    return WCMNotesLibrary.getNoteCaption(context, textType);
}

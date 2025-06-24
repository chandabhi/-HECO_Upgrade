import CommonLibrary from '../../Common/Library/CommonLibrary';
import WCMNotesLibrary from './WCMNotesLibrary';

export default function WCMNotesCount(context) {
    return CommonLibrary.getEntitySetCount(context, WCMNotesLibrary.getNotesEntitySet(context));
}

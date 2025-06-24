import {CreateUpdateFunctionalLocationEventLibrary as LibFLOC} from '../FunctionalLocationLibrary';
import style from '../../Common/Style/StyleFormCellButton';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import libCom from '../../Common/Library/CommonLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import SetUpAttachmentTypes from '../../Documents/SetUpAttachmentTypes';

export default function FunctionalLocationCreateUpdateOnPageLoad(context) {
    // clear the geometry cache
    ApplicationSettings.setString(context,'Geometry', '');

    hideCancel(context);
    LibFLOC.onPageLoad(context);
    style(context, 'DiscardButton');
    SetUpAttachmentTypes(context);
    libCom.saveInitialValues(context);
}

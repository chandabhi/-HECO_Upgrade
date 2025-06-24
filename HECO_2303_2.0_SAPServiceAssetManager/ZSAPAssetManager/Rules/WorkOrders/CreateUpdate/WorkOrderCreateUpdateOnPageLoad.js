import {WorkOrderEventLibrary as LibWoEvent} from '../WorkOrderLibrary';
import style from '../../Common/Style/StyleFormCellButton';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import libCom from '../../Common/Library/CommonLibrary';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import SetUpAttachmentTypes from '../../Documents/SetUpAttachmentTypes';

export default function WorkOrderCreateUpdateOnPageLoad(pageClientAPI) {
    // clear the geometry cache
    ApplicationSettings.setString(pageClientAPI, 'Geometry', '');

    hideCancel(pageClientAPI);
    LibWoEvent.createUpdateOnPageLoad(pageClientAPI);
    style(pageClientAPI, 'DiscardButton');

    SetUpAttachmentTypes(pageClientAPI);
    libCom.saveInitialValues(pageClientAPI);
}

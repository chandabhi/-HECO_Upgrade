import OnDateChanged from '../../../SAPAssetManager/Rules/Common/OnDateChanged';
import ZOmniLoadMapData from '../OmniSpatial/ZOmniLoadMapData';

export default function OverviewOnPageReturning(context)
{
    ZOmniLoadMapData(context);
    //Disabled with OmniSpatial
    // // Refresh the map view
    // let sectionedTable = context.getControls()[0];
    // let mapSection = sectionedTable.getSections()[0];
    // let mapViewExtension = mapSection.getExtensions()[0];
    // mapViewExtension.update();

    // // Refresh the High Prority Work Orders
    // sectionedTable.getSection('HighPriorityOrdersSection').redraw();

    // Check to see if this date has changed
    let lastDateChange = context.getClientData().lastDateChange;
    let now = new Date();

    if (lastDateChange.getDate() !== now.getDate() && now > lastDateChange)
    {
        OnDateChanged(context);
    }

}

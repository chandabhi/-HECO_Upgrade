import OverviewOnPageLoad from '../OverviewPage/OverviewOnPageLoad';
import ZOmniLoadMapData from './ZOmniLoadMapData';



export default function ZOmniOnLoad(context)
{
    ZOmniLoadMapData(context);

    //Replacing Overview.page so make sure to initialize app date
    OverviewOnPageLoad(context)
}
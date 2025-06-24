
import ZHECOGetAvailability from "../User/ZHECOGetAvailability";

export default function ZAvailabilityTitle(context) {

    let availability = ZHECOGetAvailability(context);

    if (availability == 'ACT') {
        return context.localizeText('zavailable');
    } else {
        return context.localizeText('zunavailable');
    }

}

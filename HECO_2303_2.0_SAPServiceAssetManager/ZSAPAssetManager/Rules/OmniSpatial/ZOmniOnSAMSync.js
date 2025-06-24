import ZOmniLoadMapData from "./ZOmniLoadMapData";
import DigitalSignatureCommit from "../DigitalSignature/DigitalSignatureCommit";

export default function ZOmniOnSAMSync(context) 
{
    ZOmniLoadMapData(context);
    return DigitalSignatureCommit(context);

}
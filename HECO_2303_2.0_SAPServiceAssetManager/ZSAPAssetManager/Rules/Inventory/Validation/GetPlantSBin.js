export default function GetPlantSBin(context) {
    let binding = context.binding;
    if (binding && binding.MaterialSLocs && binding.MaterialSLocs.length) {
        let sbin = binding.MaterialSLocs[0].StorageBin;
        if (sbin) {
            return sbin;
        }
    }
    return '';
}

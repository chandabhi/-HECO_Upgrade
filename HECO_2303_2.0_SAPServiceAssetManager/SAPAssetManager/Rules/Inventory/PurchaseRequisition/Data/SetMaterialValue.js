
export default function SetMaterialValue(context) {
    let material;
    let data = context.binding;

    if (data && data.Material && data.Plant) {
        material = `MaterialPlants(Plant='${data.Plant}',MaterialNum='${data.Material}')`;
    }

    return material;
}

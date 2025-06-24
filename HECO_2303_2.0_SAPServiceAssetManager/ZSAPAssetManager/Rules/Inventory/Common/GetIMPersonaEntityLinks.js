import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import Logger from '../../Log/Logger';
import PersonaLibrary from '../../Persona/PersonaLibrary';

// TODO: make generic for all personas - tbd in 2310
// this function is puts all IM entity set into app settings if IM persona is available for user

export default async function GetIMPersonaEntityLinks(context) {
    const IMPersonaName = context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/IMPersonaName.global').getValue();
    if (PersonaLibrary.checkPersonaEnabled(context, IMPersonaName)) {
        try {
            // we don't adding AppFeature to the query as far as we need all IM related entity sets
            let query = `$filter=UserPersona eq '${IMPersonaName}'`;
            
            await context.executeAction('/SAPAssetManager/Actions/OData/CreateOnlineOData.action');
            let imEntityLinks = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'PersonaFeatureEntityLinks', [], query);
            // remove duplicate entities, as we don't filter by AppFeature
            const imUniqueEntitySets = [...new Set(imEntityLinks.map(val => val.Entity))];

            if (imUniqueEntitySets && imUniqueEntitySets.length > 0) {
                ApplicationSettings.remove(context, 'IMEntityCount');
                ApplicationSettings.setNumber(context, 'IMEntityCount', imUniqueEntitySets.length);

                imUniqueEntitySets.forEach((val, index) => {
                    ApplicationSettings.remove(context, `IMEntity-${index}`);
                    ApplicationSettings.setString(context, `IMEntity-${index}`, val);
                });
            }
            return true;
        } catch (error) {
            Logger.error(`Error occured while trying to get the IM Feature Entity Links: ${error}`);
            context.getClientData().Error=error;
            return false;
        }
    }

    return true;
}

import RefObjectLinks from './RefObjectLinks';

export default function RefObjectCreateLinks(context) {
    const refObjectLinks = RefObjectLinks(context);
    return refObjectLinks.create;
}

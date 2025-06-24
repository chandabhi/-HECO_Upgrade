import RefObjectLinks from './RefObjectLinks';

export default function RefObjectDeleteLinks(context) {
    const refObjectLinks = RefObjectLinks(context);
    return refObjectLinks.delete;
}

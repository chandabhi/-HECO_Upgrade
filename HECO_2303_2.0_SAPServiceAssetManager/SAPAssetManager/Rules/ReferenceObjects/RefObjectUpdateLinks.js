import RefObjectLinks from './RefObjectLinks';

export default function RefObjectUpdateLinks(context) {
    const refObjectLinks = RefObjectLinks(context);
    return refObjectLinks.update;
}

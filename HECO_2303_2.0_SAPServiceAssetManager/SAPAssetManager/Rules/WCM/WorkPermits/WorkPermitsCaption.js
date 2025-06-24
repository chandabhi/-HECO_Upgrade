import WorkPermitsCount from './WorkPermitsCount';

export default function WorkPermitsCaption(context) {
    return WorkPermitsCount(context).then(count => {
        return context.localizeText('wcm_work_permits_x', [count]);
    });
}

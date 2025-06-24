import WorkApprovalsCount from './WorkApprovalsCount';

export default function WorkApprovalsCaption(context) {
    return WorkApprovalsCount(context).then(count => {
        return context.localizeText('work_approvals_x', [count]);
    });
}

import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';

export default function CompleteButtonText(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);

    return SupervisorLibrary.checkReviewRequired(context, binding).then((isReviewRequired) => { 
        if (isReviewRequired) {
            return context.localizeText('review');
        } else {
            return context.localizeText('complete');
        }
    });
}

import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ProgressTrackerInitialSteps(clientAPI) {

    let steps = [];
    let chapters = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceChapters');
    let currentSelectedIndex = CommonLibrary.getStateVariable(clientAPI, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let navIndex = 0;

    for (let i = 0; i < chapters.length; i++) {
        let state = chapters[i].isVisible ? chapters[i].state : 4;
        steps.push({
            'State': state,
            'Subtitle': chapters[i].name,
            'IsSubchapter': chapters[i].isSubChapter,
            'ChapterId': chapters[i].id.replace('chapter_', '').replace(/_/g,'.'),
        });
    }

    //Figure out the actual extension index to select.
    let chapter = chapters[chapters.findIndex((row) => row.index === currentSelectedIndex)];
    if (chapter) {
        navIndex = chapters[currentSelectedIndex].index;
    }

    return {
        SelectedStepIndex: navIndex,
        Steps: steps,
    };
}


export default function WCMDocumentItemSequence(context, wcmDocumentItem) {
    return context.formatNumber(Number(wcmDocumentItem.Sequence), '', { minimumIntegerDigits: 3, maximumFractionDigits: 0, useGrouping: false });
}


export default function TemplateVisibility(pageProxy) {
    let aCopyFlags = [];
    if (pageProxy.binding.CopyClassification) { 
        aCopyFlags.push('CLASSIFICATIONS_TO_COPY');
    }

    if (pageProxy.binding.CopyDocuments) { 
        aCopyFlags.push('DOCUMENT_TO_COPY');
    }

    if (pageProxy.binding.CopyMeasuringPoints) { 
        aCopyFlags.push('MEASURING_POINTS_TO_COPY');
    }

    if (pageProxy.binding.CopyPartners) { 
        aCopyFlags.push('PARTNERS_TO_COPY');
    }

    if (pageProxy.binding.CopyNote) { 
        aCopyFlags.push('LONG_TEXT_TO_COPY');
    }

    return aCopyFlags;
}

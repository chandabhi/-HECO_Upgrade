import CommonLibrary from '../../Common/Library/CommonLibrary';
import RelatedSafetyCertificatesReadLink from './RelatedSafetyCertificatesReadLink';
import { GetSectionedTableFilterTerm } from '../Common/DataQueryBuilderUtils';
import { GetSearchStringFilterTerm, ListPageQueryOptionsHelper } from '../Common/ListPageQueryOptionsHelper';

export default class SafetyCertificatesLibrary {
    /**
     * Get LOTO type code
     */
    static get typeLOTO() {
        return 'LOTO';
    }

    /**
     * Get OTHER type code
     */
    static get typeOTHER() {
        return 'OTHER';
    }

    /**
     * Get filters criteria for certificates
     * @param {String?} type certificates type
     * @returns {Array} filters criteria
     */
    static getCertificatesFiltersCriteria(type) {
        switch (type) {
            case this.typeLOTO:
                return this.getLOTOCertificatesFiltersCriteria();
            case this.typeOTHER:
                return this.getOTHERCertificatesFiltersCriteria();
            default:
                return [];
        }
    }

    static getLOTOCertificatesFiltersCriteria() {
        return [{
            field: 'WCMDocumentUsages/Specification',
            values: ['', '1', '2'],
        }];
    }

    static getOTHERCertificatesFiltersCriteria() {
        return [{
            field: 'WCMDocumentUsages/Specification',
            values: ['X'],
        }];
    }

    /**
     * Get filters criteria converted to string
     * @param {String?} type certificates type
     * @returns {String} filters criteria as string
     */
    static getCertificatesFiltersCriteriaQuery(type) {
        return this.createQueryStringFromCriterias(this.getCertificatesFiltersCriteria(type));
    }

    static createQueryStringFromCriterias(filterCriterias) {
        return filterCriterias.map(filterCriteria => filterCriteria.values.map(value => `${filterCriteria.field} eq '${value}'`).join(' or '))
            .map(criteriaString => `(${criteriaString})`)
            .join(' and ');
    }

    /**
     * Get predefined filters for Filters property in SectionedTable
     * @param {clientAPI} context MDK context
     * @param {String?} type certificates type
     * @returns {Array} list of filters
     */
    static getCertificatesFilters(context, type) {
        const filters = [context.createFilterCriteria(context.filterTypeEnum.Sorter, 'Priority', undefined, ['Priority'])];

        this.getCertificatesFiltersCriteria(type).forEach(filter => {
            filters.push(context.createFilterCriteria(context.filterTypeEnum.Filter, filter.field, undefined, filter.values));
        });

        return filters;
    }

    /**
     * Get translation keys for labels with count
     * @param {String?} type certificates type
     * @returns {Array} list of translation keys for labels with count
     */
    static getCertificatesTranslationKeysWithCount(type) {
        switch (type) {
            case this.typeLOTO:
                return ['isolation_certificates_x', 'isolation_certificates_x_x'];
            case this.typeOTHER:
                return ['other_certificates_x', 'other_certificates_x_x'];
            default:
                return ['certificates_x', 'certificates_x_x'];
        }
    }

    /**
     * Get certificates count
     * @param {clientAPI} context MDK context
     * @param {String?} type certificates type
     * @returns {Number} certificates count
     */
    static getCertificatesCount(context, type) {
        const filterQuery = this.getCertificatesFiltersCriteriaQuery(type);
        return CommonLibrary.getEntitySetCount(context, 'WCMDocumentHeaders', filterQuery && `$filter=${filterQuery}`);
    }

    /**
     * Get certificates label with count
     * @param {clientAPI} context MDK context
     * @param {String?} type certificates type
     * @returns {String} certificates label with count
     */
    static getCertificatesLabelWithCount(context, type) {
        return this.getCertificatesCount(context, type).then(count => {
            return context.localizeText(this.getCertificatesTranslationKeysWithCount(type)[0], [count]);
        });
    }

    /**
     * Get certificates list page caption with count
     * @param {clientAPI} context MDK context
     * @param {String?} type certificates type
     * @param {String?} filterQueryOption filter string
     * @returns {String} certificates list page caption with count
     */
    static getCertificatesListCaption(context, type, filterQueryOption = '') {
        const filterQuery = this.getCertificatesFiltersCriteriaQuery(type);
        const filterQueryStr = filterQuery && `$filter=${filterQuery}`;
        const totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', RelatedSafetyCertificatesReadLink(context.binding), filterQueryStr);
        const countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', RelatedSafetyCertificatesReadLink(context.binding), filterQueryOption || filterQueryStr);

        return Promise.all([totalCountPromise, countPromise]).then(([totalCount, count]) => {
            const translations = this.getCertificatesTranslationKeysWithCount(type);
            return count === totalCount ? context.localizeText(translations[0], [totalCount]) : context.localizeText(translations[1], [count, totalCount]);
        });
    }

    /**
     * Get certificates list page query options
     * @param {clientAPI} context MDK context
     * @param {String?} type certificates type
     * @returns {QueryBuilder} query builder with applied query options
     */
    static getCertificatesListQueryOptions(context, type) {
        let page;
        try {
            page = context.evaluateTargetPathForAPI('#Page:SafetyCertificatesListViewPage');
        } catch (e) {
            // Set page as undefined if query options collect not for a list page
            page = undefined;
        }
        const translations = this.getCertificatesTranslationKeysWithCount(type);
        // if navigated from work permit details page
        const binding = context.binding;
        const relatedWorkPermitFilterTerm = binding && binding['@odata.type'] === '#sap_mobile.WCMApplication' ? `WCMApplicationDocuments/any(i:i/WCMApplication eq '${binding.WCMApplication}')` : '';
        //
        const toExpand = ['WCMApplicationDocuments'];
        const filtersByType = this.getCertificatesFiltersCriteriaQuery(type);
        const sectionedTableFilterTerm = GetSectionedTableFilterTerm(page && page.getControl('SectionedTable'));
        const navigationRelatedFilterTerms = [relatedWorkPermitFilterTerm];
        const extraFilters = [GetSearchStringFilterTerm(context, context.searchString.toLowerCase(), ['WCMDocument', 'ShortText'])];
        const captionExtraFilters = filtersByType ? [filtersByType] : undefined;
        if (filtersByType) {
            extraFilters.push(filtersByType);
        }

        return ListPageQueryOptionsHelper(context, page, toExpand, sectionedTableFilterTerm, navigationRelatedFilterTerms, extraFilters, RelatedSafetyCertificatesReadLink(context.binding), translations[0], translations[1], captionExtraFilters);
    }

    /**
     * Navigate to certificates list page with predefined rules for Caption, Filters and QueryOptions according to type
     * @param {clientAPI} context MDK context
     * @param {String?} type certificates type
     */
    static navigateToCertificatesList(context, type) {
        const page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/WCM/SafetyCertificates/SafetyCertificatesListView.page');
        switch (type) {
            case this.typeLOTO:
                page.Caption = '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificatesCaption.js';
                page.Controls[0].Sections[0].Target.QueryOptions = '/SAPAssetManager/Rules/WCM/SafetyCertificates/LOTOCertificatesListViewQueryOption.js';
                break;
            case this.typeOTHER:
                page.Caption = '/SAPAssetManager/Rules/WCM/SafetyCertificates/OtherCertificatesCaption.js';
                page.Controls[0].Sections[0].Target.QueryOptions = '/SAPAssetManager/Rules/WCM/SafetyCertificates/OtherCertificatesListViewQueryOption.js';
                break;
        }
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/WCM/SafetyCertificatesListViewNav.action',
            'Properties': {
                'PageMetadata': page,
            },
        });
    }
}

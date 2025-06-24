import common from '../Library/CommonLibrary';

export default class DetailsPageToolbarClass {
    constructor() {
        this._instance = null;
        this._toolbarItems = {};
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    static resetToolbarItems(context) {
       delete this._instance._toolbarItems[common.getPageName(context)];
       if (Object.keys(this._instance._toolbarItems).length === 0) {
            this._instance = null;
        }
    }

    getToolbarItems(context) {
        return this._toolbarItems[common.getPageName(context)];
    }

    generatePossibleToolbarItems(context, items, itemNamePrefix = common.getPageName(context)) {
        if (!common.isDefined(items)) {
            this._toolbarItems[itemNamePrefix] = [];
            return Promise.resolve();
        }

        if (items.length > 3) {
            items.sort((a, b) => {
                let titleA = a.Title.toLowerCase();
                let titleB = b.Title.toLowerCase();

                if (titleA < titleB) {
                    return -1;
                }
                if (titleA > titleB) {
                    return 1;
                }
                return 0;
            });
        }

        switch (items.length) {
            case 1:
                items[0].name = itemNamePrefix + 'TbI1';
                break;
            case 2:
                items[0].name = itemNamePrefix + 'TbI0';
                items[1].name = itemNamePrefix + 'TbI2';
                break;
            case 3:
                items[0].name = itemNamePrefix + 'TbI0';
                items[1].name = itemNamePrefix + 'TbI1';
                items[2].name = itemNamePrefix + 'TbI2';
                break;
            default:
                break;
        }

        this._toolbarItems[itemNamePrefix] = items;
        return Promise.resolve();
    }

    getToolbarItemVisibility(context, itemName) {
        const pageName = common.getPageName(context);
        if (this._toolbarItems[pageName].length > 3) {
            return this.isCenterButton(itemName); // only show center button for 3+ actions
        } else {
            return this._toolbarItems[pageName].some(item => item.name === itemName);
        }
    }

    getToolbarItemCaption(context, itemName) {
        const pageName = common.getPageName(context);
        if (this._toolbarItems[pageName].length > 3) {
            return this.isCenterButton(itemName) ? context.localizeText('action') : '';
        } else {
            let itemFound = this._toolbarItems[pageName].find(item => item.name === itemName);

            if (common.isDefined(itemFound) && common.isDefined(itemFound.Title)) {
                return itemFound.Title;
            } else {
                return '';
            }
        }
    }

    getToolbarItemIsEnabled(context, itemName) {
        const pageName = common.getPageName(context);
        const itemFound = this._toolbarItems[pageName].find(item => item.name === itemName);

        return common.isDefined(itemFound) && common.isDefined(itemFound.Enabled) ? itemFound.Enabled : true;
    }

    getToolbarItemOnPressAction(context, itemName) {
        const pageName = common.getPageName(context);
        if (this._toolbarItems[pageName].length > 3) {
            return this.isCenterButton(itemName) ? {
                'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusTransitionPopover.action',
                'Properties': {
                    'PopoverItems' : this._toolbarItems[pageName],
                },
            } : '';
        } else {
            let itemFound = this._toolbarItems[pageName].find(item => item.name === itemName);

            if (common.isDefined(itemFound) && common.isDefined(itemFound.OnPress)) {
                return itemFound.OnPress;
            } else {
                return '';
            }
        }
    }

    isCenterButton(itemName) {
        return itemName.includes('TbI1');
    }
}

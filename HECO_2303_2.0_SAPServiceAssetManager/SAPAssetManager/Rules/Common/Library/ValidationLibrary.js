import libThis from './ValidationLibrary';
import LocalizationLibrary from './LocalizationLibrary';
import CommonLibrary from './CommonLibrary';
export default class {
    /*
     * determines if a value is undefined, empty or null
     */
    static evalIsEmpty(val) {
        return (val === undefined || val == null || val.length <= 0 || val === 'undefined');
    }

    /**
    * Checks if the param is a number
    */
    static evalIsNumeric(val) {
        if (libThis.evalIsEmpty(val)) return false;
        return !isNaN(Number(val)) && isFinite(val);
    }

    static evalAreNumbersEqual(context, firstNumber, secondNumber) {
        return LocalizationLibrary.toNumber(context, firstNumber) === LocalizationLibrary.toNumber(context, secondNumber);
    }

    static isFirstNumberGreaterThanSecond(context, firstNumber, secondNumber) {
        return LocalizationLibrary.toNumber(context, firstNumber) > LocalizationLibrary.toNumber(context, secondNumber);
    }

    static isFirstNumberLessThanSecond(context, firstNumber, secondNumber) {
        return LocalizationLibrary.toNumber(context, firstNumber) < LocalizationLibrary.toNumber(context, secondNumber);
    }

    static isControlEmpty(control) {
        return this.evalIsEmpty(control.getValue());
    }

    static isExceededMaxLength(control, maxLength) {
        const value = control.getValue();
        return this.evalIsEmpty(value) ? false : maxLength < value.length;
    }

    /**
    * @param {(IControlProxy & IClientAPI)[]} controls
    * @param {string[]} requiredControlNames
    * @returns {(IControlProxy & IClientAPI)[]}
    */
    static getUnfilledRequiredControls(controls, requiredControlNames) {
        return controls.filter(c => requiredControlNames.includes(c.getName()) && this.isControlEmpty(c));
    }

    /**
    * filters the argument controls array with the predicate that determines if the control's value's length is greater than the one specified on the argument controlNameToMaxLength.
    * controlNameToMaxLength is an object. e.g.: {MyExampleDescriptionFieldName: 13, MyOtherExampleFieldName: 40, ...}
    * @param {(IControlProxy & IClientAPI)[]} controls
    * @param {Object.<string, number>} controlNameToMaxLength
    * @returns {(IControlProxy & IClientAPI)[]}
    */
    static getMaxLengthExceededControls(controls, controlNameToMaxLength) {
        return controls.filter(c => (c.getName() in controlNameToMaxLength) && this.isExceededMaxLength(c, controlNameToMaxLength[c.getName()]));
    }

    /**
    * @param {(IControlProxy & IClientAPI)} control
    * @param {number} maxLength
    */
    static controlSetMaxLengthValidation(control, maxLength) {
        const valueLength = control.getValue().length;
        return maxLength < valueLength ? CommonLibrary.executeInlineControlError(control, control, control.localizeText('exceeds_max_length_x_x', [valueLength, maxLength])) : CommonLibrary.clearValidationOnInput(control);
    }

    /**
    * @param {IClientAPI} context
    * @param {(IControlProxy & IClientAPI)[]} controls
    * @param {string[]} requiredControlNames
    * @param {Object.<string, number>} controlNameToMaxLength
    * @returns {(IControlProxy & IClientAPI)[]}
    */
    static setValidationInlineErrors(context, controls, requiredControlNames, controlNameToMaxLength) {
        const unfilledRequiredControls = this.getUnfilledRequiredControls(controls, requiredControlNames);
        unfilledRequiredControls.forEach(c => CommonLibrary.executeInlineControlError(context, c, context.localizeText('field_is_required')));

        const maxLengthExceededControls = this.getMaxLengthExceededControls(controls, controlNameToMaxLength);  // we dont expect to have the same field being empty and exceeding the max char limit at the same time
        maxLengthExceededControls.forEach(c => CommonLibrary.executeInlineControlError(context, c, context.localizeText('exceeds_max_length_x_x', [c.getValue().length, controlNameToMaxLength[c.getName()]])));

        return [...unfilledRequiredControls, ...maxLengthExceededControls];
    }
}

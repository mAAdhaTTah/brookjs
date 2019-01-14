import Kefir from 'kefir';
import * as PropTypes from 'prop-types';

const spyOn = (s$, validator, propName, componentName, name) => {
    if (s$._alive) {
        const handler = (event) => {
            if (event.type === 'value') {
                PropTypes.checkPropTypes(validator, event.value, 'prop', componentName);
            }
        };
        if (!s$._spyHandlers) {
            s$._spyHandlers = [];
        }
        s$._spyHandlers.push({ name, handler });
        s$._dispatcher.addSpy(handler);

        if (s$._currentEvent) {
            handler(s$._currentEvent);
        }
    }
};

export default function observableOfValidator(valueValidator, name = 'observableOf') {
    const validator = function observableOf(props, propName, componentName) {
        const propValue = props[propName];
        if (propValue == null) {
            return null;
        }

        if (!(propValue instanceof Kefir.Observable)) {
            return new TypeError(`${componentName}: ${propName} must be an Observable, got "${typeof propValue}"`);
        }

        spyOn(propValue, valueValidator, propName, componentName, name);

        return null;
    };

    validator.isRequired = function andIsRequired(props, propName, componentName) {
        const propValue = props[propName];

        if (!(propValue instanceof Kefir.Observable)) {
            return new TypeError(`${componentName}: ${propName} must be an Observable, got "${typeof propValue}"`);
        }

        spyOn(propValue, valueValidator, propName, componentName, name);

        return null;
    };

    return wrapValidator(validator, name);
}

function wrapValidator(validator, typeName, typeChecker = null) {
    return Object.assign(validator.bind(), {
        typeName,
        typeChecker,
        isRequired: Object.assign(validator.isRequired.bind(), {
            typeName,
            typeChecker,
            typeRequired: true,
        }),
    });
}

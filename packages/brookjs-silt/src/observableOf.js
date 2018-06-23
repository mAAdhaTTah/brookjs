import Kefir from 'kefir';

const spyOn = (s$, validator, propName, componentName, name, rest) => {
    if (s$._alive) {
        const handler = ({ type, value }) => {
            if (type === 'VALUE') {
                const error = validator(value, `obsOf$${propName}`, componentName, ...rest);
                if (error instanceof Error) {
                    // eslint-disable-next-line no-console
                    console.error(`<${componentName}#${name}(${propName})>: ${error.message}`, error);
                }
            }
        };
        if (!s$._spyHandlers) {
            s$._spyHandlers = [];
        }
        s$._spyHandlers.push({ name: name, handler: handler });
        s$._dispatcher.addSpy(handler);
    }
};

export default function observableOfValidator(valueValidator, name = 'observableOf') {
    const validator = function observableOf(props, propName, componentName, ...rest) {
        const propValue = props[propName];
        if (propValue == null) {
            return null;
        }

        if (!(propValue instanceof Kefir.Observable)) {
            return new TypeError(`${componentName}: ${propName} must be an Observable, got "${typeof propValue}"`);
        }

        spyOn(propValue, valueValidator, propName, componentName, name, rest);

        return null;
    };

    validator.isRequired = function andIsRequired(props, propName,componentName, ...rest) {
        const propValue = props[propName];

        if (!(propValue instanceof Kefir.Observable)) {
            return new TypeError(`${componentName}: ${propName} must be an Observable, got "${typeof propValue}"`);
        }

        spyOn(propValue, valueValidator, propName, componentName, name, rest);

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

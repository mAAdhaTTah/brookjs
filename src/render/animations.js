import Kefir from 'kefir';
import { ANIMATE_ATTRIBUTE } from '../constants';

const animated = new Map();

const meta = {
    'attached': (container, target, parent) => ({ container, target, parent }),
    'detached': (container, target, parent) => ({ container, target, parent }),
    'replaced': (container, outgoing, parent, incoming) => ({ container, parent, incoming, outgoing })
};

/**
 * Register a container element with its animation configuration.
 *
 * @param {Element} el - Container element to register.
 * @param {Object} animations - Animations to register to this element.
 * @returns {Observable} Stream to register & unregister from
 */
export function registerElementAnimations (el, animations) {
    return Kefir.stream(() => {
        animated.set(el, animations);
        return () => animated.delete(el);
    });
}

/**
 * Generates a new effect$ by passing the provided effect$ to any
 * appropriately registered animation configuration.
 *
 * @param {string} type - Animation type.
 * @param {Observable} effect$ - Side effect-wrapping observable.
 * @param {Element} container - Container element for effect.
 * @param {Element} target - Element effect is operating on.
 * @param {Object} args - Extra args to pass to the meta function.
 * @returns {Observable} New side effect-wrapping observable.
 */
export function wrapEffect(type, effect$, container, target, ...args) {
    if (target.nodeType === 3) {
        target = target.parentNode;

        // Handle orphan text nodes.
        if (!target) {
            return effect$;
        }
    }

    if (!target.hasAttribute(ANIMATE_ATTRIBUTE)) {
        return effect$;
    }

    const name = target.getAttribute(ANIMATE_ATTRIBUTE);
    const animations = animated.get(container);

    if (!animations) {
        return effect$;
    }

    const config = animations[name];

    if (typeof config !== 'object') {
        return effect$;
    }

    const callback = config[type];

    if (typeof callback !== 'function') {
        return effect$;
    }

    return callback(effect$, typeof meta[type] === 'function' ? meta[type](container, target, ...args) : {});
}

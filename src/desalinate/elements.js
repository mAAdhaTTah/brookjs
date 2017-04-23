import { release as diffRelease } from 'diffhtml/lib';

const elements = new Set();

/**
 * Register an element as created by Desalinate.
 *
 * @param {Element} el - Element to register.
 */
export function register(el) {
    elements.add(el);
}

/**
 * Release a single element from diffHTML.
 *
 * @param {Element} el - Element to release.
 */
export function release(el) {
    diffRelease(el);
    elements.delete(el);
}

/**
 * Release all created elements by Desalinate.
 */
export function cleanup() {
    elements.forEach(diffRelease);
    elements.clear();
}

/*eslint-env mocha */
import { eventAttribute, containerAttribute } from '../';
import { expect } from 'chai';

describe('helpers', function() {
    describe('event', function() {
        it('should return click event attribute', function() {
            expect(eventAttribute('click', 'callback')).to.equal('data-brk-onclick="callback"');
        });

        it('should return focus event attribute', function() {
            expect(eventAttribute('focus', 'callback')).to.equal('data-brk-onfocus="callback"');
        });

        it('should return unknown event attribute', function() {
            expect(eventAttribute('somerandomevent', 'callback')).to.equal('data-brk-unknown="somerandomevent"');
        });
    });

    describe('container', function() {
        it('should return container attribute', function() {
            expect(containerAttribute('brkName')).to.equal('data-brk-container="brkName"');
        });
    });
});

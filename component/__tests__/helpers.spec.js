/*eslint-env mocha */
import { event, container } from '../helpers';
import { expect } from 'chai';

describe('helpers', function() {
    describe('event', function() {
        it('should return click event attribute', function() {
            expect(event('click', 'callback')).to.equal('data-brk-onclick="callback"');
        });

        it('should return focus event attribute', function() {
            expect(event('focus', 'callback')).to.equal('data-brk-onfocus="callback"');
        });

        it('should return unknown event attribute', function() {
            expect(event('somerandomevent', 'callback')).to.equal('data-brk-unknown="somerandomevent"');
        });
    });

    describe('container', function() {
        it('should return container attribute', function() {
            expect(container('brkName')).to.equal('data-brk-container="brkName"');
        });
    });
});

/* eslint-env mocha */
import { expect } from 'chai';

import { dedupeListOfMutationActions } from '../util';

describe('children util', () => {
    describe('dedupeListOfMutationRecords', () => {
        it.skip('should remove add/remove/added list', () => {
            const list = [
                {
                    'type': 'NODE_ADDED',
                    'payload': {
                        'target': {},
                        'node': {
                            'class': 'table',
                            'data-brk-container': 'settingsAccounts'
                        }
                    }
                },
                {
                    'type': 'NODE_REMOVED',
                    'payload': {
                        'target': {},
                        'node': {}
                    }
                },
                {
                    'type': 'NODE_ADDED',
                    'payload': {
                        'target': {},
                        'node': {
                            'class': 'table',
                            'data-brk-container': 'settingsAccounts'
                        }
                    }
                },
                {
                    'type': 'NODE_REMOVED',
                    'payload': {
                        'target': {},
                        'node': {
                            'class': 'table',
                            'data-brk-container': 'settingsAccounts'
                        }
                    }
                }
            ];

            expect(dedupeListOfMutationActions(list)).to.eql([
                {
                    'type': 'NODE_ADDED',
                    'payload': {
                        'target': {},
                        'node': {
                            'class': 'table',
                            'data-brk-container': 'settingsAccounts'
                        }
                    }
                },
                {
                    'type': 'NODE_REMOVED',
                    'payload': {
                        'target': {},
                        'node': {}
                    }
                }
            ]);
        });
    });
});

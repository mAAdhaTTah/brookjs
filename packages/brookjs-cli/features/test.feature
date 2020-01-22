@test
Feature: test command
  In order to maintain a project
  As a developer
  I want to run my tests

  @check
  @pass
  @js
  Scenario: Developer runs test check with formatted files
    Given I have a "js" project
    And I create "src/formatted.js" with contents
      """
      export const first = { hello: 'world' };
      """
    When I run beaver with "test check"
    And I wait for the command to finish with code 0
    Then I see this in stdout
      """
      Success! All files are correctly formatted.
      """

  @check
  @fail
  @js
  Scenario: Developer runs test check with unformatted files
    Given I have a "js" project
    And I create "src/unformatted.js" with contents
      """
      export const first ={hello: 'world' };
      """
    When I run beaver with "test check"
    And I wait for the command to finish with code 1
    Then I see this in stdout
      """
      Failure! These files are incorrectly formatted:
      """
    And I see this in stdout
      """
      Total: 1
      """

  @check
  @pass
  @ts
  Scenario: Developer runs test check with formatted files
    Given I have a "ts" project
    And I create "src/formatted.ts" with contents
      """
      export const first = { hello: 'world' };
      """
    When I run beaver with "test check"
    And I wait for the command to finish with code 0
    Then I see this in stdout
      """
      Success! All files are correctly formatted.
      """

  @check
  @fail
  @ts
  Scenario: Developer runs test check with unformatted files
    Given I have a "ts" project
    And I create "src/unformatted.ts" with contents
      """
      export const first ={hello: 'world' };
      """
    When I run beaver with "test check"
    And I wait for the command to finish with code 1
    Then I see this in stdout
      """
      Failure! These files are incorrectly formatted:
      """
    And I see this in stdout
      """
      Total: 1
      """

  @lint
  @pass
  @js
  Scenario: Developer runs test lint with formatted files
    Given I have a "js" project
    And I create "src/linted.js" with contents
      """
      export const first = { hello: 'world' };
      """
    When I run beaver with "test lint"
    And I wait for the command to finish with code 0
    Then I see this in stdout
      """
      Success! All files are correctly linted.
      """

  @lint
  @fail
  @js
  Scenario: Developer runs test check with unformatted files
    Given I have a "js" project
    And I create "src/unlinted.js" with contents
      """
      const first = { hello: 'world' };
      """
    When I run beaver with "test lint"
    And I wait for the command to finish with code 1
    Then I see this in stdout
      """
      Failure! These files have lint issues:
      """
    And I see this in stdout
      """
      Warnings: 1
      """

  @lint
  @pass
  @ts
  Scenario: Developer runs test lint with formatted files
    Given I have a "ts" project
    And I create "src/linted.ts" with contents
      """
      export const first = { hello: 'world' };
      """
    When I run beaver with "test lint"
    And I wait for the command to finish with code 0
    Then I see this in stdout
      """
      Success! All files are correctly linted.
      """

  @lint
  @fail
  @ts
  Scenario: Developer runs test check with unformatted files
    Given I have a "ts" project
    And I create "src/unlinted.ts" with contents
      """
      const first = { hello: 'world' };
      """
    When I run beaver with "test lint"
    And I wait for the command to finish with code 1
    Then I see this in stdout
      """
      Failure! These files have lint issues:
      """
    And I see this in stdout
      """
      Warnings: 1
      """

  @unit
  @pass
  @js
  Scenario: Developer runs test unit with passing tests
    Given I have a "js" project
    And I create "src/__tests__/add.spec.js" with contents
      """
      describe('passing test', () => {
        it('should pass', () => {
          expect(1 + 1).toBe(2);
        });
      });
      """
    When I run beaver with "test unit"
    And I wait for the command to finish with code 0
    Then I see this in stdout
      """
      7 passed
      """

  @unit
  @fail
  @js
  Scenario: Developer runs test unit with failing tests
    Given I have a "js" project
    And I create "src/__tests__/add.spec.js" with contents
      """
      describe('failing test', () => {
        it('fails', () => {
          expect(1 + 1).toBe(3);
        });
      });
      """
    When I run beaver with "test unit"
    And I wait for the command to finish with code 1
    Then I see this in stdout
      """
      1 failed
      """

  @unit
  @pass
  @ts
  Scenario: Developer runs test unit with passing tests
    Given I have a "ts" project
    And I create "src/__tests__/add.spec.ts" with contents
      """
      describe('passing test', () => {
        it('should pass', () => {
          expect(1 + 1).toBe(2);
        });
      });
      """
    When I run beaver with "test unit"
    And I wait for the command to finish with code 0
    Then I see this in stdout
      """
      7 passed
      """

  @unit
  @fail
  @ts
  Scenario: Developer runs test unit with failing tests
    Given I have a "ts" project
    And I create "src/__tests__/add.spec.ts" with contents
      """
      describe('failing test', () => {
        it('fails', () => {
          expect(1 + 1).toBe(3);
        });
      });
      """
    When I run beaver with "test unit"
    And I wait for the command to finish with code 1
    Then I see this in stdout
      """
      1 failed
      """

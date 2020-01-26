@format
Feature: format command
  In order to maintain a project
  As a developer
  I want to format my code

  @js
  Scenario: Developer runs format with unformatted js file
    Given I have a "js" project
    And I create "src/unformatted.js" with contents
      """
      export const first ={hello: 'world' };
      """
    When I run beaver with "format"
    And I wait for the command to finish with code 0
    Then I see this in stdout
      """
      Success! All files have been formatted.
      """
    And I see this in stdout
      """
      Formatted 1 file
      """
    And I see file "src/unformatted.js" with contents:
      """
      export const first = { hello: 'world' };
      """

  @ts
  Scenario: Developer runs format with unformatted ts file
    Given I have a "ts" project
    And I create "src/unformatted.ts" with contents
      """
      export const first ={hello: 'world' };
      """
    When I run beaver with "format"
    And I wait for the command to finish with code 0
    Then I see this in stdout
      """
      Success! All files have been formatted.
      """
    And I see this in stdout
      """
      Formatted 1 file
      """
    And I see file "src/unformatted.ts" with contents:
      """
      export const first = { hello: 'world' };
      """

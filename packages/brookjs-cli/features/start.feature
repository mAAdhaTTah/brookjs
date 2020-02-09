@start
Feature: start command
  In order to develop a project
  As a developer
  I want to run a development server

  @js
  Scenario: Developer runs start
    Given I have a "js" project
    When I run beaver with "start"
    And I wait to see in stdout:
      """
      Project is running at http://localhost:3000/
      """
    Then I see the server running on port 3000

  @ts
  Scenario: Developer runs start
    Given I have a "ts" project
    When I run beaver with "start"
    And I wait to see in stdout:
      """
      Project is running at http://localhost:3000/
      """
    Then I see the server running on port 3000

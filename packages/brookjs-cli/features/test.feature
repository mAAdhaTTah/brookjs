@test
Feature: test command
  In order to maintain a project
  As a developer
  I want to run my tests

  @unit
  @pass
  Scenario: Developer runs test unit with passing tests
    Given I have a project
    And I have a passing test
    When I run beaver with "test unit"
    And I wait for the command to finish with code 0
    Then I see passing test results

  @unit
  @fail
  Scenario: Developer runs test unit with failing tests
    Given I have a project
    And I have a failing test
    When I run beaver with "test unit"
    And I wait for the command to finish with code 1
    Then I see failing test results

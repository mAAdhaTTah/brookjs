Feature: make command
  In order to build a project
  As a developer
  I want to add new features easily

  Scenario:
    Given I have project with "actions"
    When I run beaver with "make action myAction"
    Then I see an "myAction" added to barrel for "actions"

  Scenario:
    Given I have project with "actions"
    When I run beaver with "make action myAction --file test"
    Then I see "test" exported from barrel for "actions"
    And I see "test.js" with "myAction" in "actions"

  Scenario:
    Given I have project with "actions"
    And I have a file called "test.js" exported from "actions"
    When I run beaver with "make action myAction --file test"
    Then I see "test" exported from barrel for "actions"
    And I see "test.js" with "myAction" in "actions"

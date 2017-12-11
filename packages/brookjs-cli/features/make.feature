Feature: make command
  In order to build a project
  As a developer
  I want to add new features easily

  Scenario Outline:
    Given I have project with "<type>"
    When I run beaver with "<command>"
    Then I see an "<instance>" added to barrel for "<type>"

    Examples:
      | type    | command              | instance |
      | actions | make action myAction | myAction |

  Scenario Outline:
    Given I have project with "<type>"
    When I run beaver with "<command>"
    Then I see "<opt>" exported from barrel for "<type>"
    And I see "<file>" with "<instance>" in "<type>"

    Examples:
      | type    | command                          | instance | opt  | file    |
      | actions | make action myAction --file test | myAction | test | test.js |

  Scenario Outline:
    Given I have project with "<type>"
    And I have a file called "<file>" exported from "<type>"
    When I run beaver with "<command>"
    Then I see "<opt>" exported from barrel for "<type>"
    And I see "<file>" with "<instance>" in "<type>"

    Examples:
      | type    | command                          | instance | opt  | file    |
      | actions | make action myAction --file test | myAction | test | test.js |

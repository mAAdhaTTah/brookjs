Feature: make command
  In order to build a project
  As a developer
  I want to add new features easily

  Scenario Outline:
    Given I have project with "<type>"
    When I run beaver with "<command>"
    Then I see an "<instance>" added to barrel for "<type>"

    Examples:
      | type       | command                   | instance    |
      | actions    | make action <instance>    | test        |
      | components | make component <instance> | Test        |
      | deltas     | make delta <instance>     | testDelta   |
      | reducers   | make reducer <instance>   | test        |
      | selectors  | make selector <instance>  | selectTest  |
      | services   | make service <instance>   | testService |

  Scenario Outline:
    Given I have project with "<type>"
    When I run beaver with "<command>"
    Then I see "<opt>" exported from barrel for "<type>"
    And I see "<file>" with "<instance>" in "<type>"

    Examples:
      | type       | command                                     | instance    | opt         | file           |
      | actions    | make action test --file test                | test        | test        | test.js        |
      | components | make component Test --file Test             | Test        | Test        | Test.js        |
      | deltas     | make delta testDelta --file testDelta       | testDelta   | testDelta   | testDelta.js   |
      | reducers   | make reducer test --file test               | test        | test        | test.js        |
      | selectors  | make selector selectTest --file selectTest  | selectTest  | selectTest  | selectTest.js  |
      | services   | make service testService --file testService | testService | testService | testService.js |

  Scenario Outline:
    Given I have project with "<type>"
    And I have a file called "<file>" exported from "<type>"
    When I run beaver with "<command>"
    Then I see "<opt>" exported from barrel for "<type>"
    And I see "<file>" with "<instance>" in "<type>"

    Examples:
      | type       | command                                     | instance    | opt         | file           |
      | actions    | make action test --file test                | test        | test        | test.js        |
      | components | make component Test --file Test             | Test        | Test        | Test.js        |
      | deltas     | make delta testDelta --file testDelta       | testDelta   | testDelta   | testDelta.js   |
      | reducers   | make reducer test --file test               | test        | test        | test.js        |
      | selectors  | make selector selectTest --file selectTest  | selectTest  | selectTest  | selectTest.js  |
      | services   | make service testService --file testService | testService | testService | testService.js |

@build
Feature: build command
  In order to deploy a project
  As a developer
  I want to use webpack to produce a distributible bundle

  @development
  @js
  Scenario: Developer runs build with env development
    Given I have a "js" project
    When I run beaver with "build --env development"
    And I wait for the command to finish with code 0
    Then I see a file called "dist/runtime-main.js"

  @production
  @js
  Scenario: Developer runs build with env production
    Given I have a "js" project
    When I run beaver with "build --env production"
    And I wait for the command to finish with code 0
    Then I see a file called "dist/runtime-main.js"

  @broken
  @js
  Scenario: Developer runs broken build
    Given I have a "js" project
    And I append to "src/index.js" with contents
      """
      import './file-does-not-exist';
      """
    When I run beaver with "build --env development"
    Then I wait for the command to finish with code 1

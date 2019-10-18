@build
Feature: build command
  In order to deploy a project
  As a developer
  I want to use webpack to produce a distributible bundle

  @development
  Scenario: Developer runs build with env development
    Given I have a project
    When I run beaver with "build --env development"
    And I wait for the command to finish with code 0
    Then I see a file called "dist/app.js"

  @production
  Scenario: Developer runs build with env production
    Given I have a project
    When I run beaver with "build --env production"
    And I wait for the command to finish with code 0
    Then I see a file called "dist/app.js"

  @broken
  Scenario: Developer runs broken build
    Given I have a project
    And I import an unknown file
    When I run beaver with "build --env development"
    Then I wait for the command to finish with code 1

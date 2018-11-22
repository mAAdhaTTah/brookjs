@build
Feature: build command
  In order to deploy a project
  As a developer
  I want to use webpack to produce a distributible bundle

  Scenario: Developer runs build with env development
    Given I have a project
    When I run beaver with "build --env development"
    And I wait for the command to finish with code 0
    Then I see "dist/app.js" with a file size between 1400000 and 1500000 bytes

  Scenario: Developer runs build with env production
    Given I have a project
    When I run beaver with "build --env production"
    And I wait for the command to finish with code 0
    Then I see "dist/app.js" with a file size between 250000 and 270000 bytes

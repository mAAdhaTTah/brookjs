Feature: new command
  In order to start a project
  As a developer
  I want to bootstrap a new application with configuration

  Scenario:
    When I run beaver with "new"
    And I respond to the "new" prompts
    Then I have a new project

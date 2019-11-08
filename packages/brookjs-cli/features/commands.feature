@commands
Feature: cli commands
  In order to extend the cli
  As a developer
  I want to be able to add new commands

  @valid
  @js
  Scenario: Developer adds a valid command
    Given I have a project
    And I add a "js" command with body
      """
      import React from 'react';
      import Kefir from 'kefir';
      import { Command } from 'brookjs-cli';
      import { Text } from 'ink';

      export class ValidCommand extends Command {
        builder(yargs) {
          return yargs;
        }

        cmd = 'valid';

        describe = 'A valid command!';

        initialState = () => ({});

        exec = () => () => Kefir.never();

        reducer = state => state;

        View = () => <Text>Success from ValidCommand!</Text>;
      }
      """
    When I run beaver with "valid"
    And I wait for the command to finish with code 0
    Then I see this in stdout
      """
      Success from ValidCommand!
      """

    @valid
    @ts
    Scenario: Developer adds a valid command
      Given I have a project
      And I add a "tsx" command with body
        """
        import React from 'react';
        import Kefir from 'kefir';
        import { Command } from 'brookjs-cli';
        import { Text } from 'ink';

        export class ValidCommand extends Command<any, any, any, any> {
          builder(yargs) {
            return yargs;
          }

          cmd = 'valid';

          describe = 'A valid command!';

          initialState = () => ({});

          exec = () => () => Kefir.never();

          reducer = state => state;

          View = () => <Text>Success from ValidCommand!</Text>;
        }
        """
      When I run beaver with "valid"
      And I wait for the command to finish with code 0
      Then I see this in stdout
        """
        Success from ValidCommand!
        """

@commands
Feature: cli commands
  In order to extend the cli
  As a developer
  I want to be able to add new commands

  @valid
  @js
  Scenario: Developer adds a valid js command
    Given I have a "js" project
    And I create "commands.js" with contents
      """
      import React from 'react';
      import Kefir from 'kefir';
      import { Text } from 'ink';

      export const ValidCommand = {
        builder(yargs) {
          return yargs;
        },
        cmd: 'valid',
        describe: 'A valid command!',
        View: () => <Text>Success from ValidCommand!</Text>,
      }
      """
    When I run beaver with "valid"
    And I wait for the command to finish with code 0
    Then I see this in stdout
      """
      Success from ValidCommand!
      """

    @invalid
    @js
    Scenario: Developer adds an invalid js command
      Given I have a "js" project
      And I create "commands.js" with contents
        """
        import React from 'react';
        import Kefir from 'kefir';
        import { Text } from 'ink';

        export const InvalidCommand = {
          builder(yargs) {
            return yargs;
          },
          cmd: 'valid',
          View: () => <Text>Success from ValidCommand!</Text>,
        }
        """
      When I run beaver with "valid"
      And I wait for the command to finish with code 0
      Then I see this in stdout
        """
        Required property InvalidCommand.describe missing.
        """

    @valid
    @ts
    Scenario: Developer adds a valid ts command
      Given I have a "ts" project
      And I create "commands.tsx" with contents
        """
        import React from 'react';
        import Kefir from 'kefir';
        import { Command } from 'brookjs-cli';
        import { Text } from 'ink';

        export const ValidCommand: Command<{}> = {
          builder(yargs) {
            return yargs;
          },
          cmd: 'valid',
          describe: 'A valid command!',
          View: () => <Text>Success from ValidCommand!</Text>,
        }
        """
      When I run beaver with "valid"
      And I wait for the command to finish with code 0
      Then I see this in stdout
        """
        Success from ValidCommand!
        """

      @invalid
      @ts
      Scenario: Developer adds an invalid ts command
        Given I have a "ts" project
        And I create "commands.tsx" with contents
          """
          import React from 'react';
          import Kefir from 'kefir';
          import { Command } from 'brookjs-cli';
          import { Text } from 'ink';

          export const InvalidCommand: Command<{}> = {
            builder(yargs) {
              return yargs;
            },
            cmd: 'valid',
            View: () => <Text>Success from ValidCommand!</Text>,
          }
          """
        When I run beaver with "valid"
        And I wait for the command to finish with code 0
        Then I see this in stdout
          """
          Required property InvalidCommand.describe missing.
          """

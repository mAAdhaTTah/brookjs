@new
Feature: new command
  In order to start a project
  As a developer
  I want to bootstrap a new application with configuration

  @prompts
  Scenario: Developer runs new and answers the prompts
    When I run beaver with "new test-app"
    And I respond to the prompts with:
      | text                                                      | response           |
      | What is the application version?                          | 1.0.0              |
      | What is the application description?                      | A test application |
      | Relative to the project, where will the source code live? | client             |
      | Choose a license                                          | ISC                |
      | Configuration:                                            | y                  |
    And I wait for the command to finish with code 0
    Then I see a project dir called "test-app" with file snapshots:
      | package.json               |
      | .babelrc                   |
      | .beaverrc.js               |
      | .eslintrc.js               |
      | .hygen.js                  |
      | client/app.js              |
      | client/dom.js              |
      | client/view.hbs            |
      | client/actions/app.js      |
      | client/actions/index.js    |
      | client/components/index.js |
      | client/deltas/index.js     |
      | client/reducers/index.js   |
      | client/selectors/index.js  |
      | client/services/index.js   |
      | .storybook/.babelrc        |
      | .storybook/config.js       |
      | .storybook/addons.js       |

  @yes
  Scenario: Developer runs new and accepts the defaults
    When I run beaver with "new test-app -y"
    And I wait for the command to finish with code 0
    Then I see a project dir called "test-app" with file snapshots:
      | package.json            |
      | .babelrc                |
      | .beaverrc.js            |
      | .eslintrc.js            |
      | .hygen.js               |
      | src/app.js              |
      | src/dom.js              |
      | src/view.hbs            |
      | src/actions/app.js      |
      | src/actions/index.js    |
      | src/components/index.js |
      | src/deltas/index.js     |
      | src/reducers/index.js   |
      | src/selectors/index.js  |
      | src/services/index.js   |
      | .storybook/.babelrc     |
      | .storybook/config.js    |
      | .storybook/addons.js    |

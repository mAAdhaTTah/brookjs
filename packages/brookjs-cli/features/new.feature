@new
Feature: new command
  In order to start a project
  As a developer
  I want to bootstrap a new application with configuration

  @prompts
  @js
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
      | package.json                                 |
      | .beaverrc.js                                 |
      | .storybook/.babelrc                          |
      | .storybook/main.js                           |
      | public/index.html                            |
      | public/manifest.json                         |
      | client/index.js                              |
      | client/setupTests.js                         |
      | client/state/index.js                        |
      | client/state/__tests__/state.spec.js         |
      | client/__tests__/storyshots.spec.js          |
      | client/actions/index.js                      |
      | client/actions/app.js                        |
      | client/components/App.js                     |
      | client/components/index.js                   |
      | client/components/__stories__/App.stories.js |
      | client/components/__tests__/App.spec.js      |
      | client/deltas/index.js                       |

  @yes
  @js
  Scenario: Developer runs new and accepts the defaults
    When I run beaver with "new test-app -y"
    And I wait for the command to finish with code 0
    Then I see a project dir called "test-app" with file snapshots:
      | package.json                              |
      | .beaverrc.js                              |
      | .storybook/.babelrc                       |
      | .storybook/main.js                        |
      | public/index.html                         |
      | public/manifest.json                      |
      | src/index.js                              |
      | src/setupTests.js                         |
      | src/state/index.js                        |
      | src/state/__tests__/state.spec.js         |
      | src/__tests__/storyshots.spec.js          |
      | src/actions/index.js                      |
      | src/actions/app.js                        |
      | src/components/App.js                     |
      | src/components/index.js                   |
      | src/components/__stories__/App.stories.js |
      | src/components/__tests__/App.spec.js      |
      | src/deltas/index.js                       |

  @yes
  @ts
  Scenario: Developer runs new with ts and accepts the defaults
    When I run beaver with "new test-app -y --ts"
    And I wait for the command to finish with code 0
    Then I see a project dir called "test-app" with file snapshots:
      | package.json                               |
      | tsconfig.json                              |
      | .beaverrc.ts                               |
      | .storybook/.babelrc                        |
      | .storybook/main.js                         |
      | public/index.html                          |
      | public/manifest.json                       |
      | src/index.tsx                              |
      | src/setupTests.ts                          |
      | src/state/index.ts                         |
      | src/state/__tests__/state.spec.ts          |
      | src/__tests__/storyshots.spec.ts           |
      | src/actions/index.ts                       |
      | src/actions/app.ts                         |
      | src/components/App.tsx                     |
      | src/components/index.ts                    |
      | src/components/__stories__/App.stories.tsx |
      | src/components/__tests__/App.spec.tsx      |
      | src/deltas/index.tsx                       |

import { Component, h, Text } from 'ink';
import Spinner from 'ink-spinner';
import { initConfigResponse, confirmConfig } from '../../actions';
import { selectConfirmMessage } from '../../selectors';
import Inquirer from './Inquirer';

const questions = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the application name?'
    },
    {
        type: 'input',
        name: 'version',
        message: 'What is the application version?',
        default: '0.0.0'
    },
    {
        type: 'input',
        name: 'description',
        message: 'What is the application description?',
        default: ''
    },
    {
        type: 'input',
        name: 'dir',
        message: 'Where will the application source live?',
        default: 'src'
    },
    {
        type: 'list',
        name: 'license',
        message: 'Choose a license.',
        choices: ['MIT', 'ISC']
    }
];

export default class NewCommandPrompt extends Component {
    constructor (...args) {
        super(...args);

        this.state = {
            completed: false,
            confirmed: false
        };
    }

    onComplete(response) {
        this.setState({ completed: true });
        this.props.emitter.value(initConfigResponse(response));
    }

    onConfirm(response) {
        this.setState({ confirmed: true });
        this.props.emitter.value(confirmConfig(response));
    }

    render ({ ...props }, { completed, confirmed }) {
        return (
            <span>
                <Inquirer
                    questions={questions}
                    onSubmit={response => this.onComplete(response)} />
                {completed &&
                    <Inquirer
                        questions={[{
                            type: 'confirm',
                            name: 'confirmed',
                            message: selectConfirmMessage(props)
                        }]}
                        onSubmit={response => this.onConfirm(response)} />}
                {completed && confirmed &&
                    <span>
                        <Spinner green />
                        {' '}
                        <Text bold>Creating new project</Text>
                    </span>}
            </span>
        );
    }
}

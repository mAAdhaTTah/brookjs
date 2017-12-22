import { Component, h, Text } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';

const AnsweredQuestion = ({ message, answer }) => (
    <div>
        <Text bold>{message}</Text> <Text>{answer}</Text>
    </div>
);

const ConfirmQuestion = ({ message, onSubmit }) => (
    <div>
        <div><Text bold>{message}</Text></div>
        <SelectInput
            items={[
                {
                    label: 'Yes',
                    value: true
                },
                {
                    label: 'No',
                    value: false
                }
            ]}
            onSelect={item => onSubmit(item.value)} />
    </div>
);

const ListQuestion = ({ message, choices, onSubmit }) => (
    <div>
        <div><Text bold>{message}</Text></div>
        <SelectInput
            items={choices.map(choice => ({ label: choice, value: choice }))}
            onSelect={item => onSubmit(item.value)} />
    </div>
);

const InputQuestion = ({ message, default: def, answer, onChange, onSubmit }) => (
    <div>
        <Text bold>{message}</Text>
        {def ? <span>{' '}<Text grey>({def})</Text></span> : null}
        {' '}
        <TextInput
            value={answer}
            onChange={onChange}
            onSubmit={onSubmit} />
    </div>
);

export default class Inquirer extends Component {

    constructor (...args) {
        super(...args);

        this.state = {
            step: 0,
            answers: {}
        };
    }

    setAnswer (name, answer, callback = () => {}) {
        this.setState({
            answers: {
                ...this.state.answers,
                [name]: answer
            }
        }, callback);
    }

    onSubmit () {
        const step = this.state.step + 1;

        this.setState({ step });

        if (step === this.props.questions.length) {
            this.props.onSubmit(
                this.props.questions.reduce((answers, { name, default: def }) => ({
                    ...answers,
                    [name]: this.state.answers[name] || def
                }), {})
            );
        }
    }

    render ({ questions }, { step, answers }) {
        return (
            <span>
                {questions.map(({ message, name, default: def, type, choices }, i) => {
                    if (i < step) {
                        return (
                            <AnsweredQuestion
                                message={message}
                                answer={answers[name]} />
                        );
                    }

                    if (i === step) {
                        switch (type) {
                            case 'confirm':
                                return (
                                    <ConfirmQuestion
                                        message={message}
                                        onChange={answer => this.setAnswer(name, answer)}
                                        onSubmit={answer => this.setAnswer(
                                            name,
                                            answer,
                                            () => this.onSubmit()
                                        )} />
                                );
                            case 'list':
                                return (
                                    <ListQuestion
                                        message={message}
                                        choices={choices}
                                        onSubmit={answer => this.setAnswer(
                                            name,
                                            answer,
                                            () => this.onSubmit()
                                        )} />
                                );
                            case 'input':
                                return (
                                    <InputQuestion
                                        default={def}
                                        message={message}
                                        answer={answers[name] || ''}
                                        onSubmit={() => this.onSubmit()}
                                        onChange={answer => this.setAnswer(
                                            name,
                                            answer
                                        )} />
                                );
                            default:
                                return (
                                    <Text red>Type {type} not supported.</Text>
                                );
                        }
                    }

                    return null;
                })}
            </span>
        );
    }
}

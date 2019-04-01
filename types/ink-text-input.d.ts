declare module 'ink-text-input' {
  interface InputProps {
    value: string;
    placeholder?: string;
    focus?: boolean;
    showCursor?: boolean;
    onChange?: (value: string) => void;
  }

  export default class TextInput extends React.Component<InputProps> {}
}

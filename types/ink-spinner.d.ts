declare module 'ink-spinner' {
  import { SpinnerName } from 'cli-spinners';

  interface SpinnerProps {
    type: SpinnerName;
  }

  export default class Spinner extends React.Component<SpinnerProps> {}
}

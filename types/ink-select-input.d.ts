declare module 'ink-select-input' {
  interface InputProps<T> {
    items?: { label: string; value: T }[];
    focus?: boolean;
    initialIndex?: number;
    indicatorComponent?: React.ComponentType<any>;
    itemComponent?: React.ComponentType<any>;
    limit?: number;
    onSelect?: (item: { label: string; value: T }) => void;
  }

  export default class SelectInput<T> extends React.Component<InputProps<T>> {}
}

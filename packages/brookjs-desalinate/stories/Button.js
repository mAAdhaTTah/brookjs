import { h, toJunction } from 'brookjs-silt';

const Button = ({ onClick }) => (
    <button onClick={onClick}>Click me!</button>
);

export default toJunction({
    events: {
        onClick: e$ => e$.map(() => ({ type: 'CLICK' }))
    }
})(Button);

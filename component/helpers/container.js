import { CONTAINER_ATTRIBUTE } from '../events';

export default function container(name) {
    return `${CONTAINER_ATTRIBUTE}="${name}"`;
}

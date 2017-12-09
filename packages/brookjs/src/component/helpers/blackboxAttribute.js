import { BLACKBOX_ATTRIBUTE } from '../constants';

export default function blackboxAttribute(container) {
    return `${BLACKBOX_ATTRIBUTE}="${container}"`;
}

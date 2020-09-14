import { State } from './types';

const initialState: State = {
  webpack: { status: 'idle' },
  project: { status: 'uninitialized' },
};

export default initialState;

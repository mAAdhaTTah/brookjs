import { spawn } from 'child_process';
import R from 'ramda';
import { Kefir } from 'brookjs';
import { npmCommandFinish, npmCommandOutput } from '../actions';
import { selectRoot } from '../selectors';

const partitionByEnv = R.partition(R.prop('dev'));
const pkgsFromSpec = R.map((spec) => `${spec.pkg}${spec.version ? `@${spec.version}` : ''}`);

export const install = R.curry((specs, state) => { // eslint-disable-line import/prefer-default-export
    let stream$ = Kefir.never();

    const [devs, prods] = partitionByEnv(specs);

    if (devs.length) {
        stream$ = stream$.concat(Kefir.stream(emitter => {
            const child = spawn('npm', R.concat(['i', '--save-dev'], pkgsFromSpec(devs)), {
                cwd: selectRoot(state)
            });

            child.stdout.on('data', data => {
                emitter.value(npmCommandOutput(data.toString()));
            });

            child.on('close', code => {
                emitter.value(npmCommandFinish(code));
                emitter.end();
            });
        }));
    }

    if (prods.length) {
        stream$ = stream$.concat(Kefir.stream(emitter => {
            const child = spawn('npm', R.concat(['i', '--save'], pkgsFromSpec(prods)), {
                cwd: selectRoot(state)
            });

            child.stdout.on('data', data => {
                emitter.value(npmCommandOutput(data.toString()));
            });

            child.on('close', code => {
                emitter.value(npmCommandFinish(code));
                emitter.end();
            });
        }));
    }

    return stream$;
});

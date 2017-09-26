import $$observable from 'symbol-observable';
import tape from 'tape';

tape.Test.prototype.run = function() {
    if (this._skip) {
        this.comment('SKIP ' + this.name);
    }

    if (!this._cb || this._skip) {
        return this._end();
    }

    if (this._timeout != null) {
        this.timeoutAfter(this._timeout);
    }

    this.emit('prerun');

    const result = this._cb(this);

    if (result != null && typeof result[$$observable] === 'function') {
        result[$$observable]().subscribe({
            error: err => err ? this.error(err) : this.fail(err),
            complete: () => this.end()
        });
    }

    this.emit('run');
};

export default tape;

const through2 = require('through2');
const uglify = require('uglify-js');

module.exports = function(opts) {
    return () => {
        return through2.obj(function(file, encoding, cb) {
            if (file.isNull()) {
                // nothing to do
                return cb(null, file);
            }

            try {
                const result = uglify.minify(file.contents.toString());

                if (result.error) {
                    this.emit('spearhook:error', {
                        error: result.error,
                        file
                    });
                }

                if (result.code) {
                    file.contents = Buffer.from(result.code);
                } else {
                    const err = new Error('Uglify failed to handle file.');

                    this.emit('spearhook:error', { err, file });
                }
            } catch (err) {
                this.emit('spearhook:error', { err, file });
            }

            cb(null, file);
        });
    }
};

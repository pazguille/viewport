const fs = require('fs');
const browserify = require('browserify');

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

browserify({ debug: false, standalone: 'viewport' })
  .require('./index.js', { entry: true })
  .bundle()
  .on('error', err => console.log(`Error: ${err.message}`))
  .pipe(fs.createWriteStream('dist/viewport.js'));

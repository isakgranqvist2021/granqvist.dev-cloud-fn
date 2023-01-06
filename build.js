const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const basePath = path.resolve('.');

console.log('Remove old files');
fs.rmSync(path.join(basePath, 'dist'), { recursive: true, force: true });

console.log('Compile typescript');
childProcess.execSync('npx tsc');

console.log('Create dist directory');
fs.mkdirSync(path.join(basePath, 'dist/views'));

console.log('Copy views to dist/views');
fs.cpSync(
  path.join('views'),
  path.join('dist/views'),
  { recursive: true },
  (err) => {
    console.log(err.message);
  },
);

console.log('Copy package.json to dist/package.json');
fs.cpSync(
  path.join('package.json'),
  path.join('dist/package.json'),
  {},
  (err) => {
    console.log(err.message);
  },
);

const childProcess = require('child_process');
const fs = require('fs');

const build = () => {
  fs.rmSync('dist', { recursive: true, force: true });

  childProcess.execSync('tsc');

  fs.mkdirSync('dist/views');

  fs.cpSync('views', 'dist/views', { recursive: true }, (err) => {
    console.log(err);
  });

  fs.cpSync('package.json', 'dist/package.json', {}, (err) => {
    console.log(err);
  });
};

build();

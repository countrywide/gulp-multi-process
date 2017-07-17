'use strict';

var spawn = require('child_process').spawn;

var gulpMultiProcess = function(tasks, cb) {
  var completed = 0;
  var code = 0;

  tasks.forEach(function(taskName) {
    var args = [process.argv[1], taskName];

    process.argv.forEach(function (val, i) {
      if(val[0] === '-' && val !== '--gulpfile') {
        args.push(val);
        if (process.argv[i+1] && process.argv[i+1][0] !== '-') {
          args.push(process.argv[i+1]);
        }
      }
    });

    var worker = spawn(process.execPath, args , { stdio: 'inherit' });

    worker.on('exit', function (workerCode) {
      if(workerCode !== 0)  {
        code = workerCode;
      }

      completed++;

      if(completed === tasks.length) {
        cb(code);
      }
    });
  });
};

module.exports = gulpMultiProcess;

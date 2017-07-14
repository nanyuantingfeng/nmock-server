/**************************************************
 * Created by nanyuantingfeng on 08/07/2017 12:57.
 **************************************************/
const chokidar = require('chokidar')
const path = require('path')
const {fork} = require('child_process')

module.exports = function (config) {
  let {mock, base, port} = config
  let pCWD = process.cwd()

  let forked = fork(__dirname + '/worker.js')
  forked.send(config)

  let watcher = chokidar.watch(path.join(pCWD, mock))

  watcher.on('change', (event, path) => {
    console.log('Mock Files Changed')
    forked && forked.kill()
    forked = fork('./worker.js')
    forked.send(config)
  })

}


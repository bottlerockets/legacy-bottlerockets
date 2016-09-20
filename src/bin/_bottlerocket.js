#!/usr/bin/env node
//         .
//       .' |
//     .'   |      _______       __   __   __                       __          __
//     /`-._'     |   _   .-----|  |_|  |_|  .-----.----.-----.----|  |--.-----|  |_.-----.
//    /   /       |.  1   |  _  |   _|   _|  |  -__|   _|  _  |  __|    <|  -__|   _|__ --|
//   /   /        |.  _   |_____|____|____|__|_____|__| |_____|____|__|__|_____|____|_____|
//  /   /         |:  1    \
// (`-./          |::.. .  /   github.com/bottlerockets
//  )             `-------'
// '
import { VERSION } from '../constants/cli'
import Reporter from '../cli/Reporter'
import program from 'commander'

program
  .version(VERSION)
  .usage('[options] <file ...>')
  .option('-r, --require <file>',  'require js files')
  .option('-R, --reporter [value]', 'mocha reporter (default: "spec")', 'spec')
  .option('-V, --verbose <n>',  'set logging verbosity')
  .parse(process.argv)

if (program.args.length === 0) {
  program.outputHelp()
  process.exit()
}

const files = program.args
const reporter = new Reporter({
  reporter: program.reporter,
})

reporter.setFiles(files)

reporter.run(null, 'process-exit', (result) => {
  console.log('got result')
})

if (program.reporter === 'stream') {
  process.on('message', function (msg) {
    if (typeof msg === 'object' && msg.__run__) {
      const { id, command, args } = msg.__run__
      reporter.run(id, command, args)
    }
  })
}


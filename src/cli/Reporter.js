import Mocha from 'mocha'
import { resolve } from 'path'
import { EventEmitter } from 'events'
import * as taskGlobals from './bdd/globals'
import allCommands from './bdd/allCommands'
import { resolve as pathResolve } from 'path'

const initCommand = '__INIT__'

const jsonStreamReporter = resolve(__dirname, '../reporters/stream')

const defaultSettings = {
  reporter: 'stream',
}

export default class Reporter extends EventEmitter {
  constructor(settings) {
    super()
    Object.assign(global, taskGlobals)
    this._settings = Object.assign({}, defaultSettings)
    this._ready = false
    this._starting = false
    this._queued = []
    this._files = []

    if (settings) {
      this.configure(settings)
    }
  }

  setFiles(files, directory = process.cwd()) {
    this._files = files.map(file => pathResolve(directory, file))
  }

  configure(settings) {
    this._settings = Object.assign(this._settings, settings)
  }

  getReporter() {
    const reporter = this.get('reporter')
    if (reporter === 'stream') {
      return jsonStreamReporter
    }
    return reporter
  }

  get(name) {
    if (arguments.length === 0) {
      return this._settings
    }

    return this._settings[name]
  }

  set(name, value) {
    if (arguments.length === 1) {
      return this.get(name)
    }

    this._settings[name] = value
  }

  createMochaReporter(id) {
    const mocha = new Mocha({ reporter: this.getReporter() })
    mocha.suite.commandId = id
    mocha.globals(Object.keys(taskGlobals))
    mocha.files = this._files
    return mocha
  }

  run(id, command, args, callback) {
    if (! this._ready && ! this._starting) {
      this._starting = true
      const oldWrite = process.stdout.write
      process.stdout.write = function(){}
      this._runCommand(undefined, initCommand, () => {
        process.stdout.write = oldWrite
        this._ready = true
        this._starting = false
        this._commands = allCommands()
        this._next()
      })
    }

    this._queued.push([id, command, args, callback])
    this._next()
  }

  _next() {
    if (this._ready && this._queued.length > 0) {
      while (this._queued.length > 0) {
        const [ id, command, args, callback ] = this._queued.shift()
        this._runCommand(id, command, args, callback)
      }
    }
  }

  _runCommand(id, command, args, callback) {
    let cb = (typeof args === 'function' ? args : (callback || noop))

    try {
      const mocha = this.createMochaReporter(id)

      if (this._ready && this._commands[command]) {
        mocha.suite.on('require', () => {
          this._commands[command].run(args)
        })
      }

      const result = mocha.run(code => {
        cb.call(this, code)
      })
    } catch (e) {
      cb.call(this, 1, e)
    }
  }
}

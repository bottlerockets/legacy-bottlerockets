import { join as joinPath } from 'path'
import { fork } from 'child_process'
import { EventEmitter } from 'events'
import uuid from 'node-uuid'

const BOTTLEROCKET_CLI = joinPath(__dirname, './bin/_bottlerocket.js')

const defaultSettings = {
  argv: [],
}

class Rocket extends EventEmitter {
  constructor(files = [], settings = {}) {
    super()
    this._files = Array.isArray(files) ? files : [files]
    this._onOut = this._onOut.bind(this)
    this._onKill = this._onKill.bind(this)
    this._onMessage = this._onMessage.bind(this)
    this._onError = this._onError.bind(this)
    this._settings = Object.assign({}, defaultSettings, settings)
    this._process = undefined
  }

  execute(command, args) {
    return new Promise((resolve, reject) => {
      const commandId = uuid.v4()

      if (! this._process) {
        this.spawn()
      }

      this._process.send({
        __run__: { id: commandId, command, args }
      })

      this.on('end', function (_commandId, result) {
        if (commandId === _commandId) {
          resolve(result)
        }
      })
    })
  }

  _onMessage(message) {
    if (typeof message === 'object' && message.__report__) {
      const [ eventName, commandId, result ] = message.__report__
      this.emit(eventName, commandId, result)
    }
  }

  _onOut(data) {
  }

  _onError(err) {
  }

  _onKill() {
    this._ready = false
    this._starting = false
    this._process = undefined
  }

  spawn() {
    if (this._process === undefined) {
      this._process = fork(BOTTLEROCKET_CLI, [
        '--reporter', 'stream'
      ].concat(this._files), {
        execArgv: this._settings.argv,
        silent: true,
      })

      this._process.stdout.on('data', this._onOut)
      this._process.stderr.on('data', this._onError)
      this._process.on('message', this._onMessage)
      this._process.on('exit', this._onKill)
    }
  }

  kill() {
    if (this._process !== undefined) {
      this._process.kill('SIGINT')
      this._process.kill('SIGTERM')
      this._process = undefined
    }
  }
}

export default Rocket

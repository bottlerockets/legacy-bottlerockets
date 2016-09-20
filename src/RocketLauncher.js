import { EventEmitter } from 'events'
import Rocket from './Rocket'

class RocketLauncher extends EventEmitter {
  constructor(files = []) {
    super()
    this._files = files
  }

  fire(command) {
    const rocket = new Rocket(this._files)
    return rocket.execute(command)
  }
}

export default RocketLauncher

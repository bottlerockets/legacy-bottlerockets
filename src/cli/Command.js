const hasOwn = Object.prototype.hasOwnProperty

const defineSetter = (obj, key, def) => {
  const pKey = `_${key}`
  obj[pKey] = def
  obj[key] = function (value) {
    if (arguments.length === 0) {
      return obj[pKey]
    }
    obj[pKey] = value
    return obj
  }
}

class Command {
  constructor(key) {
    defineSetter(this, 'key', key)
    defineSetter(this, 'args', {})
    defineSetter(this, 'description', null)
    defineSetter(this, 'action', null)
  }

  run(id, args) {
    if (Array.isArray(args)) {
      const cleanedArgs = Object.create(null)
      Object.keys(args).forEach((key) => {
        if (hasOwn.call(this._args, key)) {
          if (this._args[key] === Boolean) {
            cleanedArgs[key] = args[key] === '' ||
              args[key] !== 'false' &&
              args[key] !== '0' &&
              Boolean(args[key])
          } else {
            cleanedArgs[key] = this._args[key](args[key])
          }
        }
      })
    }

    return this._action(args)
  }
}

export default Command

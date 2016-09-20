import Command from '../Command'

if (! global.__registeredCommands__) {
  global.__registeredCommands__ = Object.create(null)
}

export default function command(name) {
  if (! global.__registeredCommands__[name]) {
    global.__registeredCommands__[name] = new Command(name)
  }

  return global.__registeredCommands__[name]
}

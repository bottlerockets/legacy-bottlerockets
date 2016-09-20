import { readFileSync } from 'fs'

export const VERSION = JSON.parse(readFileSync(__dirname + '/../../package.json', 'utf8')).version

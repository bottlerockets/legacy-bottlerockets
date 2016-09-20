[WIP] This project is a work in progress and is not recommended for production use

--

[![Bottlerockets Logo](https://cldup.com/WXo9ouZhmm.png)](https://bottlerockets.github.io/)

[![NPM Version][npm-image]][npm-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![Test Coverage][coveralls-image]][coveralls-url]

**Bottlerockets** is a BDD task framework for streaming queued task results with [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/). Bottlerockets can be used as a CLI tool or a task queue server to stream human readable statusses of tasks and their JSON results. Bottlerockets creates a CLI and REPL interface for your tasks for simpler debugging and improvements to your development workflow.

Bottlerockets manages and launches your *bottlerocket processes*. A bottlerocket process is a node process that runs your environment specific tasks and streams test results to your server in JSON format or to your terminal in a mocha spec format. Bottlerockets can also be optimized to run tasks quicker by running multiple tasks in the same process, though this feature is optional. Bottlerockets is built to scale and comes with load balancing algorithms to manage your tasks.

# Usage

- Run a persistent task queue server with mocha-filled results
- Run tasks with expensive setup/teardown operations quickly
- Easily scale your bottlerocket processes
- CLI interface for your bottlerocket tasks
- Run your bottlerocket tasks in a REPL

# Install

```
npm install -g bottlerockets
```

# Getting Started

Initialize `.rockets.js` in the root of your project directory:

```
bottlerockets init
```

This will create a `.bottlerockets.json` file:

```json
{
  "rockets": [
    {
      "files": ["rockets/**"],
      "balancer": "round-rocket",
      "maxInstances": 1,
      "maxTasks": 5,
      "sleep": 5
    }
  ]
}
```

```javascript
task("welcome")
  .description("This says hello to the enemy")
  .action(function () {
    describe("Name", function () {
      it("is valid", function () {
        expect(args.firstName).to.be.a('string')
        expect(args.lastName).to.be.a('string')
        task.fullName = args.firstName + " " + args.lastName
      })

      it("is not Adolf Hitler", function () {
        expect(task.fullName).to.not.be.equal('Adolf Hitler')
      })
    })
  })
```

Then run the test bottlerocket task by running:

```
bottlerocket welcome --first-name John --last-name Henrick --western
```

# Bottlerocket CLI

Bottlerockets has CLI commands:

### `bottlerockets [options] <command>`

### `bottlerocket [options] <task> [args]`

The bottlerockets task runner. Run tasks

To run a single project bottlerocket task:

```
$ bottlerocket --help

  Usage: bottlerocket [options] <task> [args]

  Tasks:

    welcome                 This says hello to the enemy
    help <task>              output help for task

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -r, --require <file>    require js files
    -R, --reporter [value]  mocha reporter (default: "spec")
    -V, --verbose <n>       set logging verbosity
```

Or run a REST server

```
$ bottlerockets http --port 8080

Starting server... (100%)

REST Server listening on port 8080...
```

# Server

[WIP]

# Node Usage

Create a queue with the Bottlerockets launcher:

```javascript
import Bottlerockets from 'bottlerockets'

/**
 * These are the defaults for a Bottlerockets instance
 */
const rockets = new Bottlerockets({
  // Load balancing method (eg. "round-robin", "queue-doubles")
  balancer: "queue-doubles",

  // Allow up to 5 tasks per single bottlerocket process
  maxTasks: 10,

  // Launch up to 10 bottlerocket processes per instance
  // With maxTasks set to 10, this allows up to 80 tasks
  // to run simultaneously
  maxInstances: 8,

  // Shut down bottlerocket processes that have not been
  // used for 5 minutes
  sleep: 5,
})

// Launch 100 rockets at once
setInterval(function () {
  for (let i = 0; i < 100; i++) {
    rockets.launch("welcome", {
      firstName: "John",
      lastName: "Henrick",
      intruder: false,
    }).success(result => {
      console.log("result", result)
    }).catch(err => {
      console.error("error", err)
    })
  }
}, 1000)

// or even run a REST server which can even be mounted
// as express.js middleware (eg. authentication)
const server = rockets.createServer()
server.listen(8080)
```

# Documentation & Community

  - [Documentation](https://docs.bottlerockets.co)
  - [API](https://docs.bottlerockets.co/api)
  - [Gitter](https://gitter.im/bottlerockets/bottlerockets)
  - [Wiki](https://github.com/bottlerockets/bottlerockets/wiki)

# License

MIT License. See [LICENSE.md](http://github.com/bottlerockets/bottlerockets/blob/master/LICENSE.md) file for details.

# Contributors

| Name           | GitHub                                  | Facebook                                   |
| -------------- | --------------------------------------- | ------------------------------------------ |
| **Sam Hunter** | [samhunta](https://github.com/samhunta) | [@samhuntr](https://facebook.com/samhuntr) |


[travis-image]: https://img.shields.io/travis/bottlerockets/bottlerockets/master.svg?label=linux
[travis-url]: https://travis-ci.org/bottlerockets/bottlerockets
[appveyor-image]: https://img.shields.io/appveyor/ci/samhunta/bottlerockets/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/samhunta/bottlerockets
[coveralls-image]: https://img.shields.io/coveralls/bottlerockets/bottlerockets/master.svg
[coveralls-url]: https://coveralls.io/r/bottlerockets/bottlerockets?branch=master
[npm-image]: https://img.shields.io/npm/v/bottlerockets.svg
[npm-url]: https://npmjs.org/package/bottlerockets

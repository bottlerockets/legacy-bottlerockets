import BaseReporter from 'mocha/lib/reporters/base'
import JSON from 'json3'

class StreamReporter extends BaseReporter {
  constructor (runner) {
    super(runner)
    this.listen(runner)
  }

  listen(runner) {
    const self = this
    const { total } = runner
    const { commandId } = runner.suite

    if (commandId === undefined || commandId === null) {
      return
    }

    runner.on('start', () => {
      process.send({ __report__: ['start', commandId, { total }]})
    })

    runner.on('pass', (test) => {
      process.send({ __report__: ['pass', commandId, clean(test)]})
    })

    runner.on('fail', (test, err) => {
      test = clean(test)
      test.err = err.message
      test.stack = err.stack || null
      process.send({ __report__: ['fail', commandId, test]})
    })

    runner.on('end', () => {
      process.send({ __report__: ['end', commandId, self.stats]})
    })
  }
}

function clean(test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry()
  }
}

// eslint-disable-next-line
module.exports = StreamReporter

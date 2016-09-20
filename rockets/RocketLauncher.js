command('pass')
  .description('Pass always')
  .action(function () {
    it('should always pass', function () {
      expect(1).to.be.equal(1)
    })
  })

command('fail')
  .description('Fail always')
  .action(function () {
    it('should always fail', function () {
      expect(1).to.be.equal(0)
    })
  })

command('process-exit')
  .description('Fail with a syntax error')
  .action(function () {
    describe('process.exit()', () => {
      it('should not kill the bottlerocket', () => {
        process.exit()
        expect(1).to.be.equal(1)
      })
    })
  })

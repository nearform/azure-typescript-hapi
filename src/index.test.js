const Code = require('code')
const Lab = require('lab')

const lab = exports.lab = Lab.script()

lab.test('lab exists', function (done) {
  Code.expect(lab).to.exist()
  done()
})

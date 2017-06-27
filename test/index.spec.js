'use strict'

const Code = require('code')
const Lab = require('lab')
const Hapi = require('hapi')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

lab.experiment('lab', function () {
  lab.test('exists', function (done) {
    Code.expect(null).to.exist()
    done()
  })

  lab.test('has properties', function (done) {
    Code.expect(Object.keys(lab)).to.not.have.length(0)
    done()
  })
})

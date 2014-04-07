// Base58 encoding/decoding
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas

var BigInteger = require('./bigint')

// FIXME: ? This is a Base58Check alphabet
var alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
var base = new BigInteger('58')

var alphabetMap = {}
for (var i=0; i<alphabet.length; ++i) {
  var chr = alphabet[i]
  alphabetMap[chr] = new BigInteger(i.toString())
}

// encode a byte array into a base58 encoded String
// @return String
function encode(buffer) {
  var bi = BigInteger.fromBuffer(buffer)
  var chars = []

  while (bi.cmp(base) >= 0) {
    var mod = bi.mod(base)
    bi = bi.sub(mod).div(base)

    chars.push(alphabet[parseInt(mod.toString())]) //TODO: remove bigint from here and add tests
  }

  chars.push(alphabet[parseInt(bi.toString())]) //TODO: remove bigint from here and add tests

  // Convert leading zeros too.
  for (var i=0; i<buffer.length; i++) {
    if (buffer[i] !== 0x00) break

    chars.push(alphabet[0])
  }

  return chars.reverse().join('')
}

// decode a base58 encoded String into a byte array
// @return Array
function decode(str) {
  var num = BigInteger.ZERO

  var leading_zero = 0
  var seen_other = false

  for (var i=0; i<str.length; ++i) {
    var chr = str[i]
    var bi = alphabetMap[chr]

    // if we encounter an invalid character, decoding fails
    if (bi === undefined) {
      throw new Error('invalid base58 string: ' + str)
    }

    num = num.mul(base).add(bi)

    if (chr === '1' && !seen_other) {
      ++leading_zero
    } else {
      seen_other = true
    }
  }

  var pad = new Buffer(leading_zero)
  pad.fill(0)

  return Buffer.concat([pad, num.toBuffer()])
}

module.exports = {
  encode: encode,
  decode: decode
}

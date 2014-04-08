var BigIntegerSuper = require('bignum')
var convert = require('./convert')

var constructor = BigIntegerSuper('0').constructor

function BigInteger() {
  var bigint = BigIntegerSuper.apply(this, arguments)
  bigint.constructor = constructor
  return bigint
}

BigInteger.prototype = constructor.prototype // unable to do proper extension because it's a native prototype

// Patch it up until we consistently passing buffer as arg (rather than array sometimes)
BigInteger.fromBuffer = function(buffer) {
  var arr = Array.prototype.slice.call(buffer, 0)
  return new BigInteger(convert.bytesToHex(arr), 16)
}

BigInteger.prototype.toByteArrayUnsigned = function() {
  var arr = Array.prototype.slice.call(this.abs().toBuffer(), 0)
  return (arr[0] === 0) ? arr.slice(1) : arr
}

BigInteger.prototype.toByteArraySigned = function() {
  var val = this.toByteArrayUnsigned();
  var neg = this.lt(0)

  // if the first bit is set, we always unshift
  // either unshift 0x80 or 0x00
  if (val[0] & 0x80) {
    val.unshift((neg) ? 0x80 : 0x00);
  }
  // if the first bit isn't set, set it if negative
  else if (neg) {
    val[0] |= 0x80;
  }

  return val;
}

BigInteger.ZERO = new BigInteger('0')
BigInteger.ONE = new BigInteger('1')

module.exports = BigInteger

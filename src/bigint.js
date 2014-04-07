var BigInteger = require('bigint')

BigInteger.prototype.testBit = function(i){
  var mask = new Buffer(this.abs().toBuffer().length)
  mask.fill(255)

  var bits = this.and(BigInteger.fromBuffer(mask)).toString(2)
  return bits.split('').reverse()[i] === '1'
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

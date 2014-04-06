var BigInteger = require('bigi')

// FIXME: remove once bigi supports typed arrays/buffers
BigInteger.fromBuffer = function(buffer) {
  if (Buffer.isBuffer(buffer)) {
    buffer = Array.prototype.map.bind(buffer, function(x) { return x })()
  }

  return BigInteger.fromByteArrayUnsigned(buffer)
}

module.exports = BigInteger

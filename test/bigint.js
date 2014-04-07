var assert = require('assert')
var BigInteger = require('../').BigInteger

describe('BigInteger', function() {
  describe('testBit', function() {
    it('returns true if the the bit at the given position is set', function() {
      assertBits(new BigInteger('120'), '00011110')
      assertBits(new BigInteger('129'), '1000000100000000')
      assertBits(new BigInteger('128'), '0000000100000000')
      assertBits(new BigInteger('-128'), '00000001')
      // assertBits(new BigInteger('-127'), '10000001') TODO: fix negative numbers
    })

    function assertBits(bigint, bits){
      bits.split('').forEach(function(b, i){
        var set = bigint.testBit(i)
        assert.equal(set, b === '1')
      })
    }
  })

  describe('toByteArrayUnsigned', function(){
    it('returns empty array for 0', function() {
      assert.deepEqual(BigInteger.ZERO.toByteArrayUnsigned(), [])
    })

    it('returns a byte array represeting the absolute value of the big integer', function() {
      var expectedByteArray = [38, 153, 183, 24, 53, 137, 232, 71, 231, 179, 154, 117, 67, 118]
      var i = new BigInteger('782910138827292261791972728324982')

      assert.deepEqual(i.toByteArrayUnsigned(), expectedByteArray)
      assert.deepEqual(i.neg().toByteArrayUnsigned(), expectedByteArray)
    })
  })

  describe('toByteArraySigned', function(){
    it('returns empty array for 0', function() {
      assert.deepEqual(BigInteger.ZERO.toByteArraySigned(), [])
    })

    it('converts big integer to signed byte representation', function() {
      var i = new BigInteger('1')
      assert.deepEqual(i.toByteArraySigned(), [1])
      assert.deepEqual(i.neg().toByteArraySigned(), [129])

      i = new BigInteger('255')
      assert.deepEqual(i.toByteArraySigned(), [0, 255])
      assert.deepEqual(i.neg().toByteArraySigned(), [128, 255])
    })
  })
})

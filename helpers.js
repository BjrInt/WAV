module.exports = {
  euclid: (x, y) => x - x % y,

  TypedArray: {
    8: Uint8Array,
    16: Uint16Array,
    32: Float32Array
  },

  WriteType: {
    8: 'writeUInt8',
    16: 'writeUInt16BE',
    32: 'writeFloatBE'
  },

  toAB: (buf) => {
    const ab = new ArrayBuffer(buf.length)
    const ui8 = new Uint8Array(ab)
    for(let i=0;i<buf.length;i++){
      ui8[i] = buf[i]
    }

    return ab
  }
}

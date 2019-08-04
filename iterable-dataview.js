const IterableDV = DataView

IterableDV.prototype.globalOffset = 0

IterableDV.prototype.getStr = function(length){
  const slice = new DataView(this.buffer, this.globalOffset, length)
  let ret = ''

  for(let i=0;i<length;i++){
    ret += String.fromCharCode(slice.getUint8(i))
    this.globalOffset++
  }

  return ret
}

IterableDV.prototype.getShort = function(signed=false, BE=true){
  const ret = signed
              ? this.getInt16(this.globalOffset, BE)
              : this.getUint16(this.globalOffset, BE)
  this.globalOffset = this.globalOffset + 2

  return ret
}

IterableDV.prototype.getLong = function(signed=false, BE=true){
  const ret = signed
              ? this.getInt32(this.globalOffset, BE)
              : this.getUint32(this.globalOffset, BE)
  this.globalOffset = this.globalOffset + 4

  return ret
}

IterableDV.prototype.getEnd = function(){
  return this.buffer.slice(this.globalOffset)
}

module.exports = IterableDV

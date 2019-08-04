const IterableDV = require('./iterable-dataview.js')
const { euclid, TypedArray, WriteType, toAB } = require('./helpers.js')

module.exports = function(buffer){
  this.headers = buffer.slice(0, 44)
  const dv = new IterableDV(buffer)

  this.RIFF = dv.getStr(4) === 'RIFF'
  this.fileSize = dv.getLong()
  this.WAVE = dv.getStr(4) === 'WAVE'
  this.fmt = dv.getStr(4) === 'fmt '

  this.chunkSize = dv.getLong()
  this.audioFormat = dv.getShort()
  this.nbChannels = dv.getShort()
  this.sampleRate = dv.getLong()
  this.bytesPerSec = dv.getLong()
  this.bytesPerChunk = dv.getShort()
  this.bitsPerSample = dv.getShort()

  this.dataChunkId = dv.getLong()
  this.dataSize = dv.getLong()
  this.data = dv.getEnd()


  // Useful
  this.bytesPerMS = this.bytesPerSec / 1000
  this.lengthMS = euclid(this.dataSize / this.bytesPerMS, this.bytesPerChunk)
  this.typedArray = TypedArray[this.bitsPerSample]
  this.writeType = WriteType[this.bitsPerSample]



  this.isValid = () => this.RIFF && this.WAVE && this.fmt



  this.getWindow = function(offset, length){
    const start = euclid(this.bytesPerMS * offset, this.bytesPerChunk)
    const size = euclid(this.bytesPerMS * length, this.bytesPerChunk)

    return this.data.slice(start, start + size)
  }



  this.getChunk = function(offset=0){
    const byteOffset = offset * this.bytesPerChunk
    return new this.typedArray(this.data.slice(byteOffset, byteOffset + this.bytesPerChunk))
  }



  this.fillSilence = function(length=0){
    const arLength = euclid(this.bytesPerMS * length, this.bytesPerChunk)
    return new this.typedArray(arLength).fill(0)
  }



  this.save = function(){
    let ret = Buffer.from([])

    const data = new Buffer.from(this.data)
    const dataSize = data.byteLength
    const fileSize = dataSize + 44

    const newHeaders = Buffer.from(this.headers)
    newHeaders.writeUInt32LE(fileSize, 4)
    newHeaders.writeUInt32LE(dataSize, 40)

    this.headers = newHeaders

    ret = Buffer.concat([ret, newHeaders, data])

    return ret
  }


  this.transpose = (factor) => {
    const nbChunks = this.dataSize / this.bytesPerChunk
    const finalSize = Math.floor(nbChunks / factor)
    let data = Buffer.alloc(finalSize * this.bytesPerChunk)

    for(i=0;i<finalSize;i++){
      const pos = Math.floor(i * factor)
      const chunk = this.getChunk(pos)
      chunk.forEach((x, j) => data[this.writeType](x, i * this.bytesPerChunk + j))
    }

    return {
      ...this,
      data: toAB(data)
    }
  }
}

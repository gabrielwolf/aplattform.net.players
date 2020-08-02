import Omnitone from '../node_modules/omnitone/build/omnitone.esm.js'

export default class OmnitonePlayer {
  constructor (src, order, channelMap) {
    this.src = src
    this.order = order
    this.channelMap = channelMap
  }

  src = () => this.src
  order = () => this.order
  channelMap = () => this.channelMap

  initialize = () => {
    this.audioContext = new AudioContext()
    this.inputGain = this.audioContext.createGain()
    if (this.order === 1) {
      this.ambisonicsRenderer = Omnitone.createFOARenderer(this.audioContext,
        { channelMap: this.channelMap })
    } else if (this.order === 2 || this.order === 3) {
      this.ambisonicsRenderer = Omnitone.createHOARenderer(this.audioContext,
        { ambisonicOrder: this.order })
    }
    this.ambisonicsRenderer.initialize()
  }

  load = () => {
    this.listOfFileNames = []
    let file1, file2
    switch (this.order) {
      case 1:
        Promise.all([
          Omnitone.createBufferList(this.audioContext,
            [this.src]),
        ]).then((results) => {
          this.contentBuffer = Omnitone.mergeBufferListByChannel(
            this.audioContext,
            results[0])
        })
        break
      case 2:
        file1 = this.src.substring(0,
          this.src.length - this.src.split('.').pop().length - 1)
          + '_ch1-8' + '.' + this.src.split('.').pop()
        file2 = this.src.substring(0,
          this.src.length - this.src.split('.').pop().length - 1)
          + '_ch9' + '.' + this.src.split('.').pop()
        this.listOfFileNames.push(file1)
        this.listOfFileNames.push(file2)
        Promise.all([
          Omnitone.createBufferList(this.audioContext,
            [this.listOfFileNames[0], this.listOfFileNames[1]]),
        ]).then((results) => {
          this.contentBuffer = Omnitone.mergeBufferListByChannel(
            this.audioContext,
            results[0])
        })
        break
      case 3:
        file1 = this.src.substring(0,
          this.src.length - this.src.split('.').pop().length - 1)
          + '_ch1-8' + '.' + this.src.split('.').pop()
        file2 = this.src.substring(0,
          this.src.length - this.src.split('.').pop().length - 1)
          + '_ch9-16' + '.' + this.src.split('.').pop()
        this.listOfFileNames.push(file1)
        this.listOfFileNames.push(file2)
        Promise.all([
          Omnitone.createBufferList(this.audioContext,
            [this.listOfFileNames[0], this.listOfFileNames[1]]),
        ]).then((results) => {
          this.contentBuffer = Omnitone.mergeBufferListByChannel(
            this.audioContext,
            results[0])
        })
        break
    }
  }

  play = (from) => {
    if (this.currentBufferSource) {
      this.currentBufferSource.stop()
      this.currentBufferSource.disconnect()
    }
    this.inputGain.connect(this.ambisonicsRenderer.input)
    this.ambisonicsRenderer.output.connect(this.audioContext.destination)
    this.currentBufferSource = this.audioContext.createBufferSource()
    this.currentBufferSource.buffer = this.contentBuffer
    this.currentBufferSource.loop = false
    this.currentBufferSource.connect(this.inputGain)
    this.currentBufferSource.start(0,
      from * this.contentBuffer.length / this.contentBuffer.sampleRate)
    console.log('HOAPlayer playing...')
  }

  pause = () => {
    if (this.currentBufferSource.playbackRate.value === 1)
      this.currentBufferSource.playbackRate.value = 0
    else if (this.currentBufferSource.playbackRate.value === 0)
      this.currentBufferSource.playbackRate.value = 1
  }

  stop = () => {
    if (this.currentBufferSource) {
      this.currentBufferSource.stop()
      this.currentBufferSource.disconnect()
    }
  }
}

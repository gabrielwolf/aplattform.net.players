import Omnitone from '../node_modules/omnitone/build/omnitone.esm.js'

export default class OmnitonePlayer {
  constructor (src, order, channelMap) {
    this.src = src
    this.order = order
    this.channelMap = channelMap
    this.playingStartedAtTimeInMilliseconds = 0
    this.playedFromPosition = .0
    this.elapsedTimeInMilliSeconds = 0
    this.durationInSeconds = 0
  }

  get getElapsedTimeInSeconds () {
    return this.elapsedTimeInMilliSeconds / 1000
  }

  calcElapsed = () => {
    this.offset = this.playedFromPosition * this.durationInSeconds
    this.elapsedTimeInMilliSeconds = Date.now() -
      this.playingStartedAtTimeInMilliseconds + this.offset * 1000
  }

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
    this.inputGain.connect(this.ambisonicsRenderer.input)
    this.ambisonicsRenderer.output.connect(this.audioContext.destination)
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
          this.durationInSeconds = this.contentBuffer.length /
            this.contentBuffer.sampleRate
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
          this.durationInSeconds = this.contentBuffer.length /
            this.contentBuffer.sampleRate
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
          this.durationInSeconds = this.contentBuffer.length /
            this.contentBuffer.sampleRate
        })
        break
    }
  }

  play = (from) => {
    if (this.currentBufferSource) {
      this.currentBufferSource.stop()
      this.currentBufferSource.disconnect()
    }
    this.currentBufferSource = this.audioContext.createBufferSource()
    this.currentBufferSource.buffer = this.contentBuffer
    this.currentBufferSource.loop = false
    this.currentBufferSource.connect(this.inputGain)
    this.playingStartedAtTimeInMilliseconds = Date.now()
    this.playedFromPosition = parseFloat(from)
    if (this.calcElapsedHandler)
      clearInterval(this.calcElapsedHandler)
    this.calcElapsedHandler = setInterval(() => this.calcElapsed(), 10)
    this.currentBufferSource.start(0,
      from * this.durationInSeconds)
    if (this.order === 1)
      console.log('FOAPlayer playing...')
    else if (this.order === 2 || this.order === 3)
      console.log('HOAPlayer playing...')
  }

  stop = () => {
    if (this.currentBufferSource) {
      clearInterval(this.calcElapsedHandler)
      this.currentBufferSource.stop()
      this.currentBufferSource.disconnect()
    }
  }

  resume = () => {
    this.play((this.elapsedTimeInMilliSeconds / 1000) / this.durationInSeconds)
  }
}

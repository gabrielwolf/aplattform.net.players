import Omnitone from '../node_modules/omnitone/build/omnitone.esm.js'
import { Player } from './player.esm.js'

export default class HOAPlayer extends Player {
  constructor (src, order) {
    super(src, order)
  }

  set currentPosition (position) {
    // stub
    console.log(position)
  }

  initialize = () => {
    this.audioContext = new AudioContext()
    this.inputGain = this.audioContext.createGain()
    this.hoaRenderer = Omnitone.createHOARenderer(this.audioContext,
      { ambisonicOrder: this.order })
    this.hoaRenderer.initialize()
  }

  async loadFiles () {
    let moreChannels
    if (this.order === 2)
      moreChannels = '_ch9'
    else if (this.order === 3)
      moreChannels = '_ch9-16'
    this.fileName1 = this.src.substring(0, this.src.length - 5) + '_ch1-8' +
      this.src.slice(-5)
    this.fileName2 = this.src.substring(0, this.src.length - 5) + moreChannels +
      this.src.slice(-5)
    return await Omnitone.createBufferList(this.audioContext,
      [this.fileName1, this.fileName2])
  }

  play = () => {
    if (!this.audioContext) {
      this.initialize()
    }
    Promise.all([
        this.loadFiles(),
      ],
    ).then((results) => {
      this.contentBuffer = Omnitone.mergeBufferListByChannel(
        this.audioContext,
        results[0])
      this.contentBuffer2 = this.audioContext.createBuffer(
        this.contentBuffer.numberOfChannels,
        this.contentBuffer.length,
        this.contentBuffer.sampleRate)

      let destinationChannelIndex = 0
      for (let j = 0; j < this.contentBuffer.numberOfChannels; ++j) {
        this.contentBuffer2.getChannelData(destinationChannelIndex++).set(
          this.contentBuffer.getChannelData(j))
      }

      console.log(this.contentBuffer)
      console.log(this.contentBuffer2)

      this.inputGain.connect(this.hoaRenderer.input)
      this.hoaRenderer.output.connect(this.audioContext.destination)
      this.currentBufferSource = this.audioContext.createBufferSource()
      this.currentBufferSource.buffer = this.contentBuffer2
      this.currentBufferSource.loop = false
      this.currentBufferSource.connect(this.inputGain)
      this.currentBufferSource.start()
      console.log('HOAPlayer playing...')
    })
  }

  stop = () => {
    this.currentBufferSource.stop()
    this.currentBufferSource.disconnect()
  }
}

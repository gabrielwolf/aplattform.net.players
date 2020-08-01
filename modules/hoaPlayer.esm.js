import Omnitone from '../node_modules/omnitone/build/omnitone.esm.js'
import { Player } from './player.esm.js'

export default class HOAPlayer extends Player {
  constructor (src, order) {
    super(src, order)
  }

  initialize = () => {
    this.audioContext = new AudioContext()
    this.inputGain = this.audioContext.createGain()
    this.hoaRenderer = Omnitone.createHOARenderer(this.audioContext,
      { ambisonicOrder: this.order })
    this.hoaRenderer.initialize()
  }

  load = () => {
    let channelsSecondFile
    if (this.order === 2)
      channelsSecondFile = '_ch9'
    else if (this.order === 3)
      channelsSecondFile = '_ch9-16'
    this.fileName1 = this.src.substring(0, this.src.length - 5) + '_ch1-8' +
      this.src.slice(-5)
    this.fileName2 = this.src.substring(0, this.src.length - 5) +
      channelsSecondFile +
      this.src.slice(-5)
    Promise.all([
      Omnitone.createBufferList(this.audioContext,
        [this.fileName1, this.fileName2]),
    ]).then((results) => {
      this.contentBuffer = Omnitone.mergeBufferListByChannel(
        this.audioContext,
        results[0])
    })
  }

  play = (from) => {
    if (this.currentBufferSource) {
      this.currentBufferSource.stop()
      this.currentBufferSource.disconnect()
    }
    this.inputGain.connect(this.hoaRenderer.input)
    this.hoaRenderer.output.connect(this.audioContext.destination)
    this.currentBufferSource = this.audioContext.createBufferSource()
    this.currentBufferSource.buffer = this.contentBuffer
    this.currentBufferSource.loop = false
    this.currentBufferSource.connect(this.inputGain)
    this.currentBufferSource.start(0,
      from * this.contentBuffer.length / this.contentBuffer.sampleRate)
    console.log('HOAPlayer playing...')
  }

  stop = () => {
    if (this.currentBufferSource) {
      this.currentBufferSource.stop()
      this.currentBufferSource.disconnect()
    }
  }
}

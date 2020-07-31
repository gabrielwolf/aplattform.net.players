'use strict'

import Omnitone from '../node_modules/omnitone/build/omnitone.min.esm.js'
import { Player } from './player.esm.js'

export default class HOAPlayer extends Player {
  constructor (src, order) {
    super(src, order)
  }

  set currentPosition (position) {
    try {
      if (!this.audioContext) throw 'No audioContext!'
      if (isNaN(position)
        || position < 0
        || position > 1) throw 'Not a floating point number between 0 and 1!'
      this.audioContext.currentTime = position *
        this.audioContext.duration
    } catch (e) {
      console.log(e)
    }
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
    return await Omnitone.createBufferList(
      this.audioContext,
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

      this.contentBuffer2 = this.contentBuffer
      // this.inputGain.connect(this.hoaRenderer.input)
      // this.hoaRenderer.output.connect(this.audioContext.destination)
      // this.currentBufferSource = this.audioContext.createBufferSource()
      // this.currentBufferSource.buffer = this.contentBuffer
      // this.currentBufferSource.loop = false
      // this.currentBufferSource.connect(this.inputGain)
      // this.currentBufferSource.start()
      // console.log('HOAPlayer playing...')
    })
  }

  stop = () => {
    this.currentBufferSource.stop()
    this.currentBufferSource.disconnect()
  }
}

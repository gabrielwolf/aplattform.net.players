import Omnitone from '../node_modules/omnitone/build/omnitone.esm.js'
import { Player } from './player.esm.js'

export default class FOAPlayer extends Player {
  constructor (src, order) {
    super(src, order)
  }

  set currentPosition (position) {
    try {
      if (!this.audioElement) throw 'No audio Element!'
      if (isNaN(position)
        || position < 0
        || position > 1) throw 'Not a floating point number between 0 and 1!'
      this.audioElement.currentTime = position * this.audioElement.duration
    } catch (e) {
      console.log(e)
    }
  }

  initialize = () => {
    this.audioElement = document.createElement('audio')
    this.audioElement.src = this.src
    this.audioElement.loop = false
    this.audioElement.crossOrigin = 'anonymous'
    this.audioContext = new AudioContext()
    this.audioElementSource = this.audioContext.createMediaElementSource(
      this.audioElement)
    this.foaRenderer = Omnitone.createFOARenderer(this.audioContext, {
      // The example audio is in the FuMa ordering (W,X,Y,Z). So remap the
      // channels to the ACN format.
      channelMap: [0, 3, 1, 2],
    })
  }

  play = () => {
    if (!this.audioContext) {
      this.initialize()
    }
    this.foaRenderer.initialize().then(() => {
      this.audioElementSource.connect(this.foaRenderer.input)
      this.foaRenderer.output.connect(this.audioContext.destination)
      this.audioContext.resume()
      this.audioElement.play()
      console.log('FOAPlayer playing...')
    })
  }

  pause = () => this.audioElement.pause()
}

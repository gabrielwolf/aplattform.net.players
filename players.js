'use strict'

class Player {
  constructor (src) {
    this.src = src
  }

  src = () => this.src
  play = () => console.log('Player playing...')
}

class FOAPlayer extends Player {
  constructor (src) {
    super(src)
    this.audioElement = document.createElement('audio')
    this.audioElement.src = src
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
    this.foaRenderer.initialize().then(value => {
      this.audioElementSource.connect(this.foaRenderer.input)
      this.foaRenderer.output.connect(this.audioContext.destination)
      this.audioContext.resume()
      this.audioElement.play()
      console.log('FOAPlayer playing...')
    })
  }
  pause = () => this.audioElement.pause()
}

class HOAPlayer extends Player {
  constructor (src, order) {
    super(src)
    this.audioContext = new AudioContext()
    this.inputGain = this.audioContext.createGain()
    this.hoaRenderer = Omnitone.createHOARenderer(this.audioContext,
      { ambisonicOrder: order })
    let moreChannels
    if (order === 2)
      moreChannels = '_ch9'
    else if (order === 3)
      moreChannels = '_ch9-16'
    const file1 = src.substring(0, src.length - 5) + '_ch1-8' + src.slice(-5)
    const file2 = src.substring(0, src.length - 5) + moreChannels +
      src.slice(-5)
    Promise.all([
      Omnitone.createBufferList(this.audioContext, [file1, file2]),
      this.hoaRenderer.initialize(),
    ]).then((results) => {
      this.contentBuffer = Omnitone.mergeBufferListByChannel(this.audioContext,
        results[0])
      this.inputGain.connect(this.hoaRenderer.input)
      this.hoaRenderer.output.connect(this.audioContext.destination)
    })
  }

  play = () => {
    this.currentBufferSource = this.audioContext.createBufferSource()
    this.currentBufferSource.buffer = this.contentBuffer
    this.currentBufferSource.loop = false
    this.currentBufferSource.connect(this.inputGain)
    this.currentBufferSource.start()
    console.log('HOAPlayer playing...')
  }
  stop = () => {
    this.currentBufferSource.stop()
    this.currentBufferSource.disconnect()
  }
}

import Omnitone from '../node_modules/omnitone/build/omnitone.esm.js'

export default class OmnitonePlayer {
  constructor (src, order, channelMap) {
    this.src = src
    this.order = order
    this.channelMap = channelMap
    this.playbackStartedAtTimeInMilliseconds = 0
    this.playedFromPosition = .0
    this.elapsedTimeInMilliSeconds = 0
    this.durationInSeconds = 0
  }

  get elapsedTimeInSeconds () {
    return this.elapsedTimeInMilliSeconds / 1000
  }

  set gain (gain) {
    this.inputGain.gain.exponentialRampToValueAtTime(
      Math.pow(10, parseFloat(gain) / 20),
      this.audioContext.currentTime + 0.5,
    )
  }

  static crossProduct (a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ]
  }

  static normalize (a) {
    const n = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
    a[0] /= n
    a[1] /= n
    a[2] /= n
    return a
  }

  // ---------------- Helpers ----------------

  rotateSoundfield (azimuth, elevation) {
    const rotationMatrix3 = new Float32Array(9)

    const theta = azimuth / 180 * Math.PI
    const phi = elevation / 180 * Math.PI

    const forward = [
      Math.sin(theta) * Math.cos(phi),
      Math.sin(phi),
      Math.cos(theta) * Math.cos(phi),
    ]
    const upInitial = [0, 1, 0]
    const right = OmnitonePlayer.normalize(
      OmnitonePlayer.crossProduct(forward, upInitial))
    const up = OmnitonePlayer.normalize(
      OmnitonePlayer.crossProduct(right, forward))

    rotationMatrix3[0] = right[0]
    rotationMatrix3[1] = right[1]
    rotationMatrix3[2] = right[2]
    rotationMatrix3[3] = up[0]
    rotationMatrix3[4] = up[1]
    rotationMatrix3[5] = up[2]
    rotationMatrix3[6] = forward[0]
    rotationMatrix3[7] = forward[1]
    rotationMatrix3[8] = forward[2]

    this.ambisonicsRenderer.setRotationMatrix3(rotationMatrix3)
  }

  finalizeLoading = () => {
    this.rotateSoundfield(0, 0)
    this.durationInSeconds = this.contentBuffer.length /
      this.contentBuffer.sampleRate
  }

  clearCurrentBufferSource = () => {
    this.currentBufferSource.stop()
    this.currentBufferSource.disconnect()
  }

  updateElapsedTimeInMilliSeconds = () => {
    this.offset = this.playedFromPosition * this.durationInSeconds * 1000
    this.elapsedTimeInMilliSeconds = Date.now() -
      this.playbackStartedAtTimeInMilliseconds + this.offset
  }

  // ---------------- Main functions ----------------

  initialize = () => {
    this.audioContext = new AudioContext()
    this.inputGain = this.audioContext.createGain()
    if (this.order === 1) {
      this.ambisonicsRenderer = Omnitone.createFOARenderer(this.audioContext,
        { channelMap: this.channelMap })
    } else if (this.order > 1) {
      this.ambisonicsRenderer = Omnitone.createHOARenderer(this.audioContext,
        { channelMap: this.channelMap, ambisonicOrder: this.order })
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
        }).then(() => {
          this.finalizeLoading()
        })
        break

      case 2:
        file1 = this.src.substring(0,
          this.src.length - this.src.split('.').pop().length - 1)
          + '_ch0-7' + '.' + this.src.split('.').pop()
        file2 = this.src.substring(0,
          this.src.length - this.src.split('.').pop().length - 1)
          + '_ch8' + '.' + this.src.split('.').pop()

        this.listOfFileNames.push(file1)
        this.listOfFileNames.push(file2)

        Promise.all([
          Omnitone.createBufferList(this.audioContext,
            [this.listOfFileNames[0], this.listOfFileNames[1]]),
        ]).then((results) => {
          this.contentBuffer = Omnitone.mergeBufferListByChannel(
            this.audioContext,
            results[0])
        }).then(() => {
          this.finalizeLoading()
        })
        break

      case 3:
        file1 = this.src.substring(0,
          this.src.length - this.src.split('.').pop().length - 1)
          + '_ch0-7' + '.' + this.src.split('.').pop()
        file2 = this.src.substring(0,
          this.src.length - this.src.split('.').pop().length - 1)
          + '_ch8-15' + '.' + this.src.split('.').pop()

        this.listOfFileNames.push(file1)
        this.listOfFileNames.push(file2)

        Promise.all([
          Omnitone.createBufferList(this.audioContext,
            [this.listOfFileNames[0], this.listOfFileNames[1]]),
        ]).then((results) => {
          this.contentBuffer = Omnitone.mergeBufferListByChannel(
            this.audioContext,
            results[0])
        }).then(() => {
          this.finalizeLoading()
        })
        break
    }
  }

  play = (from) => {
    if (this.currentBufferSource) {
      this.clearCurrentBufferSource()
    }
    this.currentBufferSource = this.audioContext.createBufferSource()
    this.currentBufferSource.buffer = this.contentBuffer
    this.currentBufferSource.loop = false
    this.currentBufferSource.connect(this.inputGain)
    this.playbackStartedAtTimeInMilliseconds = Date.now()
    this.playedFromPosition = parseFloat(from)
    if (this.calcElapsedHandler)
      clearInterval(this.calcElapsedHandler)
    this.calcElapsedHandler = setInterval(
      () => this.updateElapsedTimeInMilliSeconds(), 10)
    this.currentBufferSource.start(0,
      from * this.durationInSeconds)
    if (this.order === 1)
      console.log('FOAPlayer playing...')
    else if (this.order === 2 || this.order === 3)
      console.log('HOAPlayer playing...')
    this.currentBufferSource.onended = () => {
      // TODO clear elapsed time and clear setInterval
    }
  }

  stop = () => {
    if (this.currentBufferSource) {
      clearInterval(this.calcElapsedHandler)
      this.clearCurrentBufferSource()
    }
  }

  resume = () => {
    this.play((this.elapsedTimeInMilliSeconds / 1000) / this.durationInSeconds)
  }
}

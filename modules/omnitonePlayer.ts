//  Generic Ambisonics Player Classes
//    Copyright (C) 2020 Gabriel Wolf <gabriel.wolf@posteo.de>
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as published
//    by the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.

// @ts-ignore
import Omnitone from '../node_modules/omnitone/build/omnitone.esm.js'

export default class OmnitonePlayer {
  private readonly _src: string
  private readonly _order: number
  private readonly _channelMap: number[]

  private _playbackStartedAtTimeInMilliseconds: number
  private _playedFromPosition: number
  private _elapsedTimeInMilliSeconds: number
  private _offset: number
  private _calcElapsedHandler: number

  private _audioContext: any
  private _inputGain: any
  private _contentBuffer: any
  private _ambisonicsRenderer: any
  private _currentBufferSource: any

  constructor(src: string, order: number, channelMap: number[]) {
    this._src = src
    this._order = order
    this._channelMap = channelMap
    this._playbackStartedAtTimeInMilliseconds = 0
    this._playedFromPosition = .0
    this._elapsedTimeInMilliSeconds = 0
    this._offset = 0
    this._calcElapsedHandler = 0
    this._durationInSeconds = 0
    this._loop = false
  }

  private _loop: boolean

  get loop() {
    return this._loop
  }

  set loop(value) {
    this._loop = value
  }

  private _durationInSeconds: number

  get durationInSeconds() {
    return this._durationInSeconds
  }

  get elapsedTimeInSeconds() {
    return this._elapsedTimeInMilliSeconds / 1000
  }

  set gain(gain: string) {
    this._inputGain.gain.exponentialRampToValueAtTime(
        Math.pow(10, parseFloat(gain) / 20),
        this._audioContext.currentTime + 0.2,
    )
  }

  static crossProduct(a: number[], b: number[]) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ]
  }

  static getListOfFileNames(src: string, order: number): string[] {
    if (!src.indexOf('.'))
      Error("Filename has no extension!")

    let file: string[] = src.split('.')
    let extension: string = <string>file.pop()

    let listOfFileNames: string[] = [], postfix: string[] = []

    switch (order) {
      case 1:
        postfix = ['']
        break

      case 2:
        postfix = ['_ch0-7', '_ch8']
        break

      case 3:
        postfix = ['_ch0-7', '_ch8-15']
        break
    }

    postfix.forEach(item => {
      listOfFileNames.push(
          src.substring(0, src.length - extension.length - 1)
          + item
          + '.' + src.split('.').pop(),
      )
    })
    return listOfFileNames
  }

  static normalize(a: number[]) {
    const n = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
    a[0] /= n
    a[1] /= n
    a[2] /= n
    return a
  }

  // ---------------- Helpers ----------------

  rotateSoundfield(azimuth: number, elevation: number) {
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

    this._ambisonicsRenderer.setRotationMatrix3(rotationMatrix3)
  }

  finalizeLoading = () => {
    this.rotateSoundfield(0, 0)
    this._durationInSeconds = this._contentBuffer.length /
        this._contentBuffer.sampleRate
  }

  clearCurrentBufferSource = () => {
    this._currentBufferSource.stop()
    this._currentBufferSource.disconnect()
  }

  updateElapsedTimeInMilliSeconds = () => {
    this._offset = this._playedFromPosition * this._durationInSeconds * 1000
    this._elapsedTimeInMilliSeconds = Date.now() -
        this._playbackStartedAtTimeInMilliseconds + this._offset
  }

  // ---------------- Main functions ----------------

  async init() {
    this._audioContext = new AudioContext()
    this._inputGain = this._audioContext.createGain()
    if (this._order === 1) {
      this._ambisonicsRenderer = await Omnitone.createFOARenderer(
          this._audioContext,
          { channelMap: this._channelMap })
    } else if (this._order > 1) {
      this._ambisonicsRenderer = await Omnitone.createHOARenderer(
          this._audioContext,
          { channelMap: this._channelMap, ambisonicOrder: this._order })
    }
    this._ambisonicsRenderer.initialize()
    this._inputGain.connect(this._ambisonicsRenderer.input)
    this._ambisonicsRenderer.output.connect(this._audioContext.destination)
  }

  async load() {
    if (this._order === 1) {
      const results = await Omnitone.createBufferList(this._audioContext,
          [this._src])
      this._contentBuffer = await Omnitone.mergeBufferListByChannel(
          this._audioContext,
          results,
      )
    } else if (this._order === 2 || this._order === 3) {
      const results = await Omnitone.createBufferList(this._audioContext,
          [
            OmnitonePlayer.getListOfFileNames(this._src, this._order)[0],
            OmnitonePlayer.getListOfFileNames(this._src, this._order)[1],
          ])
      this._contentBuffer = await Omnitone.mergeBufferListByChannel(
          this._audioContext,
          results,
      )
    }
    this.finalizeLoading()
  }

  play(from: number) {
    if (this._currentBufferSource) {
      this.clearCurrentBufferSource()
    }
    this._currentBufferSource = this._audioContext.createBufferSource()
    this._currentBufferSource.buffer = this._contentBuffer
    this._currentBufferSource.loop = false
    this._currentBufferSource.connect(this._inputGain)
    this._playbackStartedAtTimeInMilliseconds = Date.now()
    this._playedFromPosition = from
    if (this._calcElapsedHandler)
      clearInterval(this._calcElapsedHandler)
    this._calcElapsedHandler = setInterval(
        () => this.updateElapsedTimeInMilliSeconds(), 10)
    this._currentBufferSource.start(0, from * this._durationInSeconds)
    if (this._order === 1)
      console.log('FOAPlayer playing...')
    else if (this._order === 2 || this._order === 3)
      console.log('HOAPlayer playing...')
    this._currentBufferSource.onended = () => {
      let lastChanceToStopBeforeEndOfSongInSeconds = 1
      if (Math.abs(this._durationInSeconds - this.elapsedTimeInSeconds) <
          lastChanceToStopBeforeEndOfSongInSeconds) {
        clearInterval(this._calcElapsedHandler)
        this._playedFromPosition = .0
        this._elapsedTimeInMilliSeconds = 0

        if (this._loop) {
          this.play(0)
        }
      }
    }
  }

  stop() {
    if (this._currentBufferSource) {
      clearInterval(this._calcElapsedHandler)
      this.clearCurrentBufferSource()
    }
  }

  resume() {
    this.play(
        (this._elapsedTimeInMilliSeconds / 1000) / this._durationInSeconds)
  }
}

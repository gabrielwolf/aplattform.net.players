'use strict'

export class Player {
  constructor (src, order) {
    this.src = src
    this.order = order
  }

  src = () => this.src
  order = () => this.order
  play = () => console.log('Player playing...')
}

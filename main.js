import FOAPlayer from './modules/foaPlayer.esm.js'
import HOAPlayer from './modules/hoaPlayer.esm.js'

const foa = new FOAPlayer('sounds/foa.flac')
const soa = new HOAPlayer('sounds/soa.flac', 2)
const toa = new HOAPlayer('sounds/toa.flac', 3)

// FOA
document.getElementById('foa-play').
  addEventListener('click', foa.play)
document.getElementById('foa-pause').
  addEventListener('click', foa.pause)
document.getElementById('foa-setCurrentPosition').
  addEventListener('click', function () {
    foa.currentPosition = document.getElementById('foa-position').value
  })

// SOA
document.getElementById('soa-init').
  addEventListener('click', soa.initialize)
document.getElementById('soa-load').
  addEventListener('click', soa.load)
document.getElementById('soa-play').
  addEventListener('click', function () {
    soa.play(document.getElementById('soa-position').value)
  })
document.getElementById('soa-pause').
  addEventListener('click', soa.pause)
document.getElementById('soa-stop').
  addEventListener('click', soa.stop)

// TOA
document.getElementById('toa-init').
  addEventListener('click', toa.initialize)
document.getElementById('toa-load').
  addEventListener('click', toa.load)
document.getElementById('toa-play').
  addEventListener('click', function () {
    toa.play(document.getElementById('toa-position').value)
  })
document.getElementById('toa-pause').
  addEventListener('click', toa.pause)
document.getElementById('toa-stop').
  addEventListener('click', toa.stop)

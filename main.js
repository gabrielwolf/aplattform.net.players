import OmnitonePlayer from './modules/omnitonePlayer.js'

const foa = new OmnitonePlayer('sounds/foa.flac', 1)
const soa = new OmnitonePlayer('sounds/soa.flac', 2)
const toa = new OmnitonePlayer('sounds/toa.flac', 3)

// FOA
document.getElementById('foa-init').
  addEventListener('click', foa.initialize)
document.getElementById('foa-load').
  addEventListener('click', foa.load)
document.getElementById('foa-play').
  addEventListener('click', function () {
    foa.play(document.getElementById('foa-position').value)
  })
document.getElementById('foa-pause').
  addEventListener('click', foa.pause)
document.getElementById('foa-stop').
  addEventListener('click', foa.stop)

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

import FOAPlayer from './modules/foaPlayer.esm.js'
import HOAPlayer from './modules/hoaPlayer.esm.js'

const foa = new FOAPlayer('sounds/foa.flac')
window.soa = new HOAPlayer('sounds/soa.flac', 2)
const toa = new HOAPlayer('sounds/toa.flac', 3)

document.getElementById('foa-play').addEventListener('click', foa.play)
document.getElementById('foa-pause').addEventListener('click', foa.pause)
document.getElementById('foa-setCurrentPosition').addEventListener('click',
  function () {
    foa.currentPosition = document.getElementById('foa-position').value
  })

document.getElementById('soa-init').
  addEventListener('click', window.soa.initialize)
document.getElementById('soa-load').addEventListener('click', window.soa.load)
document.getElementById('soa-play').addEventListener('click', window.soa.play)
document.getElementById('soa-stop').addEventListener('click', window.soa.stop)
document.getElementById('soa-setCurrentPosition').addEventListener('click',
  function () {
    soa.currentPosition = document.getElementById('soa-position').value
  })

document.getElementById('toa-play').addEventListener('click', toa.play)
document.getElementById('toa-stop').addEventListener('click', toa.stop)
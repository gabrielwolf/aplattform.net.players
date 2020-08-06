import OmnitonePlayer from './modules/omnitonePlayer.js'

window.foa = new OmnitonePlayer('sounds/foa.flac', 1, [0, 3, 1, 2])
window.soa = new OmnitonePlayer('sounds/soa.flac', 2)
window.toa = new OmnitonePlayer('sounds/toa.flac', 3)

// FOA
document.getElementById('foa-init').
  addEventListener('click', window.foa.initialize)
document.getElementById('foa-load').
  addEventListener('click', window.foa.load)
document.getElementById('foa-play').
  addEventListener('click', function () {
    window.foa.play(document.getElementById('foa-position').value)
  })
document.getElementById('foa-stop').
  addEventListener('click', window.foa.stop)
document.getElementById('foa-resume').
  addEventListener('click', window.foa.resume)
document.getElementById('foa-update').
  addEventListener('click', function () {
    document.getElementById(
      'foa-progress').max = window.foa.durationInSeconds
    setInterval(() => {
      document.getElementById(
        'foa-progress').value = window.foa.elapsedTimeInSeconds
    }, 1)
  })
document.getElementById('foa-gain').
  addEventListener('input', (event) => {
    let gain = document.getElementById('foa-gain').value
    document.getElementById('foa-gain-label').textContent = gain
    window.foa.gain = gain
  })

// SOA
document.getElementById('soa-init').
  addEventListener('click', window.soa.initialize)
document.getElementById('soa-load').
  addEventListener('click', window.soa.load)
document.getElementById('soa-play').
  addEventListener('click', function () {
    window.soa.play(document.getElementById('soa-position').value)
  })
document.getElementById('soa-stop').
  addEventListener('click', window.soa.stop)
document.getElementById('soa-resume').
  addEventListener('click', window.soa.resume)
document.getElementById('soa-update').
  addEventListener('click', function () {
    document.getElementById(
      'soa-progress').max = window.soa.durationInSeconds
    setInterval(() => {
      document.getElementById(
        'soa-progress').value = window.soa.elapsedTimeInSeconds
    }, 100)
  })
document.getElementById('soa-gain').
  addEventListener('input', (event) => {
    let gain = document.getElementById('soa-gain').value
    document.getElementById('soa-gain-label').textContent = gain
    window.soa.gain = gain
  })

// TOA
document.getElementById('toa-init').
  addEventListener('click', window.toa.initialize)
document.getElementById('toa-load').
  addEventListener('click', window.toa.load)
document.getElementById('toa-play').
  addEventListener('click', function () {
    window.toa.play(document.getElementById('toa-position').value)
  })
document.getElementById('toa-stop').
  addEventListener('click', window.toa.stop)
document.getElementById('toa-resume').
  addEventListener('click', window.toa.resume)
document.getElementById('toa-update').
  addEventListener('click', function () {
    document.getElementById(
      'toa-progress').max = window.toa.durationInSeconds
    setInterval(() => {
      document.getElementById(
        'toa-progress').value = window.toa.elapsedTimeInSeconds
    }, 100)
  })
document.getElementById('toa-gain').
  addEventListener('input', (event) => {
    let gain = document.getElementById('toa-gain').value
    document.getElementById('toa-gain-label').textContent = gain
    window.toa.gain = gain
  })
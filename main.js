import OmnitonePlayer from './modules/omnitonePlayer.js'

const foa = new OmnitonePlayer('sounds/foa.wav', 1, [0, 3, 1, 2])
const soa = new OmnitonePlayer('sounds/soa.flac', 2,
  [0, 3, 1, 2, 6, 7, 5, 8, 4])
const toa = new OmnitonePlayer('sounds/toa.flac', 3)

// ---------------- FOA ----------------

document.getElementById('foa-init').
  addEventListener('click', foa.initialize)
document.getElementById('foa-load').
  addEventListener('click', foa.load)
document.getElementById('foa-play').
  addEventListener('click', function () {
    foa.play(document.getElementById('foa-position').value)
  })
document.getElementById('foa-stop').
  addEventListener('click', foa.stop)
document.getElementById('foa-resume').
  addEventListener('click', foa.resume)
document.getElementById('foa-update').
  addEventListener('click', function () {
    document.getElementById('foa-progress').max = foa.durationInSeconds
    setInterval(() => {
      document.getElementById('foa-progress').value = foa.elapsedTimeInSeconds
    }, 1)
  })
document.getElementById('foa-gain').
  addEventListener('input', (event) => {
    const gain = document.getElementById('foa-gain').value
    document.getElementById('foa-gain-label').textContent = gain
    foa.gain = gain
  })
document.getElementById('foa-azimuth').
  addEventListener('input', (event) => {
    const azimuth = parseFloat(document.getElementById('foa-azimuth').value)
    const elevation = parseFloat(document.getElementById('foa-elevation').value)
    document.getElementById('foa-azimuth-label').
      textContent = String(azimuth)
    document.getElementById('foa-elevation-label').
      textContent = String(elevation)
    foa.rotateSoundfield(azimuth, elevation)
  })
document.getElementById('foa-elevation').
  addEventListener('input', (event) => {
    const azimuth = parseFloat(document.getElementById('foa-azimuth').value)
    const elevation = parseFloat(document.getElementById('foa-elevation').value)
    document.getElementById('foa-azimuth-label').
      textContent = String(azimuth)
    document.getElementById('foa-elevation-label').
      textContent = String(elevation)
    foa.rotateSoundfield(azimuth, elevation)
  })

// ---------------- SOA ----------------

document.getElementById('soa-init').
  addEventListener('click', soa.initialize)
document.getElementById('soa-load').
  addEventListener('click', soa.load)
document.getElementById('soa-play').
  addEventListener('click', () => {
    soa.play(document.getElementById('soa-position').value)
  })
document.getElementById('soa-stop').
  addEventListener('click', soa.stop)
document.getElementById('soa-resume').
  addEventListener('click', soa.resume)
document.getElementById('soa-update').
  addEventListener('click', () => {
    document.getElementById('soa-progress').max = soa.durationInSeconds
    setInterval(() => {
      document.getElementById(
        'soa-progress').value = soa.elapsedTimeInSeconds
    }, 100)
  })
document.getElementById('soa-gain').
  addEventListener('input', (event) => {
    const gain = document.getElementById('soa-gain').value
    document.getElementById('soa-gain-label').textContent = gain
    soa.gain = gain
  })
document.getElementById('soa-azimuth').
  addEventListener('input', (event) => {
    const azimuth = parseFloat(document.getElementById('soa-azimuth').value)
    const elevation = parseFloat(document.getElementById('soa-elevation').value)
    document.getElementById('soa-azimuth-label').
      textContent = String(azimuth)
    document.getElementById('soa-elevation-label').
      textContent = String(elevation)
    soa.rotateSoundfield(azimuth, elevation)
  })
document.getElementById('soa-elevation').
  addEventListener('input', (event) => {
    const azimuth = parseFloat(document.getElementById('soa-azimuth').value)
    const elevation = parseFloat(document.getElementById('soa-elevation').value)
    document.getElementById('soa-azimuth-label').
      textContent = String(azimuth)
    document.getElementById('soa-elevation-label').
      textContent = String(elevation)
    soa.rotateSoundfield(azimuth, elevation)
  })

// ---------------- TOA ----------------

document.getElementById('toa-init').
  addEventListener('click', toa.initialize)
document.getElementById('toa-load').
  addEventListener('click', toa.load)
document.getElementById('toa-play').
  addEventListener('click', () => {
    toa.play(document.getElementById('toa-position').value)
  })
document.getElementById('toa-stop').
  addEventListener('click', toa.stop)
document.getElementById('toa-resume').
  addEventListener('click', toa.resume)
document.getElementById('toa-update').
  addEventListener('click', function () {
    document.getElementById('toa-progress').max = toa.durationInSeconds
    setInterval(() => {
      document.getElementById(
        'toa-progress').value = toa.elapsedTimeInSeconds
    }, 100)
  })
document.getElementById('toa-gain').
  addEventListener('input', (event) => {
    const gain = document.getElementById('toa-gain').value
    document.getElementById('toa-gain-label').textContent = gain
    toa.gain = gain
  })
document.getElementById('toa-azimuth').
  addEventListener('input', (event) => {
    const azimuth = parseFloat(document.getElementById('toa-azimuth').value)
    const elevation = parseFloat(document.getElementById('toa-elevation').value)
    document.getElementById('toa-azimuth-label').
      textContent = String(azimuth)
    document.getElementById('toa-elevation-label').
      textContent = String(elevation)
    toa.rotateSoundfield(azimuth, elevation)
  })
document.getElementById('toa-elevation').
  addEventListener('input', (event) => {
    const azimuth = parseFloat(document.getElementById('toa-azimuth').value)
    const elevation = parseFloat(document.getElementById('toa-elevation').value)
    document.getElementById('toa-azimuth-label').
      textContent = String(azimuth)
    document.getElementById('toa-elevation-label').
      textContent = String(elevation)
    toa.rotateSoundfield(azimuth, elevation)
  })
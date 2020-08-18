import OmnitonePlayer from './modules/omnitonePlayer.js'

// ---------------- FOA ----------------

const e = {
  foa: new OmnitonePlayer('sounds/foa.flac', 1, [0, 3, 1, 2]),
  soa: new OmnitonePlayer('sounds/soa.flac', 2, [0, 3, 1, 2, 6, 7, 5, 8, 4]),
  toa: new OmnitonePlayer('sounds/toa.flac', 3),
}

for (const eKey in e) {
  document.getElementById(eKey + '-init').
    addEventListener('click', e[eKey].initialize)
  document.getElementById(eKey + '-load').
    addEventListener('click', e[eKey].load)
  document.getElementById(eKey + '-play').
    addEventListener('click', () => {
      e[eKey].play(document.getElementById(eKey + '-position').value)
    })
  document.getElementById(eKey + '-stop').
    addEventListener('click', e[eKey].stop)
  document.getElementById(eKey + '-resume').
    addEventListener('click', e[eKey].resume)
  document.getElementById(eKey + '-update').
    addEventListener('click', () => {
      document.getElementById(
        eKey + '-progress').max = e[eKey].durationInSeconds
      setInterval(() => {
        document.getElementById(
          eKey + '-progress').value = e[eKey].elapsedTimeInSeconds
      }, 1)
    })
  document.getElementById(eKey + '-gain').
    addEventListener('input', () => {
      const gain = document.getElementById(eKey + '-gain').value
      document.getElementById(eKey + '-gain-label').textContent = gain
      e[eKey].gain = gain
    })
  document.getElementById(eKey + '-azimuth').
    addEventListener('input', () => {
      const azimuth = parseFloat(
        document.getElementById(eKey + '-azimuth').value)
      const elevation = parseFloat(
        document.getElementById(eKey + '-elevation').value)
      document.getElementById(eKey + '-azimuth-label').
        textContent = String(azimuth)
      document.getElementById(eKey + '-elevation-label').
        textContent = String(elevation)
      e[eKey].rotateSoundfield(azimuth, elevation)
    })
  document.getElementById(eKey + '-elevation').
    addEventListener('input', () => {
      const azimuth = parseFloat(
        document.getElementById(eKey + '-azimuth').value)
      const elevation = parseFloat(
        document.getElementById(eKey + '-elevation').value)
      document.getElementById(eKey + '-azimuth-label').
        textContent = String(azimuth)
      document.getElementById(eKey + '-elevation-label').
        textContent = String(elevation)
      e[eKey].rotateSoundfield(azimuth, elevation)
    })
}

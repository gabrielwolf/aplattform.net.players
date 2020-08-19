import OmnitonePlayer from './modules/omnitonePlayer.js'

const e = {
  // First order FuMa example
  foa: window.foa = new OmnitonePlayer('sounds/foa.flac', 1,
    [0, 3, 1, 2]),
  // Second order FuMa example
  soa: window.soa = new OmnitonePlayer('sounds/soa.flac', 2,
    [0, 3, 1, 2, 6, 7, 5, 8, 4]),
  // Third order AmbiX example
  toa: window.toa = new OmnitonePlayer('sounds/toa.flac', 3),

  // window. is for debugging
}

for (const eKey in e) {
  document.getElementById(eKey + '-init').
    addEventListener('click', () => {
      e[eKey].initialize().then(() => {
        document.getElementById(eKey + '-init').disabled = true
        document.getElementById(eKey + '-load').disabled = false
      })
    })
  document.getElementById(eKey + '-load').
    addEventListener('click', () => {
      document.getElementById(eKey + '-load').disabled = true
      document.getElementById(eKey + '-load').innerText = 'Loading...'
      e[eKey].load().then(() => {
        document.getElementById(eKey + '-play').disabled = false
        document.getElementById(eKey + '-position').disabled = false
        document.getElementById(eKey + '-update-progress').disabled = false
        document.getElementById(eKey + '-gain').disabled = false
        document.getElementById(eKey + '-progress').disabled = false
        document.getElementById(eKey + '-azimuth').disabled = false
        document.getElementById(eKey + '-elevation').disabled = false
        document.getElementById(eKey + '-load').innerText = 'Loaded'
      })
    })
  document.getElementById(eKey + '-play').
    addEventListener('click', () => {
      e[eKey].play(document.getElementById(eKey + '-position').value)
      document.getElementById(eKey + '-stop').disabled = false
    })
  document.getElementById(eKey + '-stop').
    addEventListener('click', () => {
      e[eKey].stop()
      document.getElementById(eKey + '-resume').disabled = false
    })
  document.getElementById(eKey + '-resume').
    addEventListener('click', () => {
      e[eKey].resume()
      document.getElementById(eKey + '-resume').disabled = true
    })
  document.getElementById(eKey + '-update-progress').
    addEventListener('click', () => {
      document.getElementById(
        eKey + '-progress').max = e[eKey].durationInSeconds
      setInterval(() => {
        document.getElementById(
          eKey + '-progress',
        ).value = e[eKey].elapsedTimeInSeconds
      }, 1)
      document.getElementById(eKey + '-update-progress').disabled = true
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

//  Generic Ambisonics Player Classes
//    Copyright (C) 2020 Gabriel Wolf <gabriel.wolf@posteo.de>
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as published
//    by the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.

import OmnitonePlayer from './modules/omnitonePlayer.js'

const e = {
  // First order FuMa example
  foa: window.foa = new OmnitonePlayer('sounds/foa.flac', 1,
    [0, 3, 1, 2]),

  // Second order FuMa example
  soa: window.soa = new OmnitonePlayer('sounds/soa.flac', 2,
    [0, 3, 1, 2, 6, 7, 5, 8, 4]),

  // Third order ambiX example
  toa: window.toa = new OmnitonePlayer('sounds/toa.flac', 3),

  // window. is just for debugging purposes, can be removed in production
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
        document.getElementById(eKey + '-loop').disabled = false
        document.getElementById(eKey + '-position').disabled = false
        document.getElementById(eKey + '-gain').disabled = false
        document.getElementById(eKey + '-progress').disabled = false
        document.getElementById(eKey + '-azimuth').disabled = false
        document.getElementById(eKey + '-elevation').disabled = false
        document.getElementById(eKey + '-load').innerText = 'Loaded'
        document.getElementById(
          eKey + '-duration').innerText = secondsToReadableTime(
          e[eKey].durationInSeconds,
        )
        document.getElementById(
          eKey + '-progress').max = e[eKey].durationInSeconds
        setInterval(() => {
          document.getElementById(
            eKey + '-progress',
          ).value = e[eKey].elapsedTimeInSeconds
          document.getElementById(
            eKey + '-current-time').innerText = secondsToReadableTime(
            e[eKey].elapsedTimeInSeconds,
          )
        }, 50)
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
      document.getElementById(
        eKey + '-position').value = e[eKey].elapsedTimeInSeconds /
        e[eKey].durationInSeconds
    })

  document.getElementById(eKey + '-resume').
    addEventListener('click', () => {
      e[eKey].resume()
      document.getElementById(eKey + '-resume').disabled = true
    })

  document.getElementById(eKey + '-loop').
    addEventListener('click', () => {
      e[eKey].loop = document.getElementById(eKey + '-loop').checked
    })

  document.getElementById(eKey + '-progress').
    addEventListener('click', function (e) {
      let x = e.pageX - this.offsetLeft,
        percentage = x / this.offsetWidth
      console.log(percentage)
      document.getElementById(eKey + '-position').value = percentage
      document.getElementById(eKey + '-play').click()
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

function secondsToReadableTime (seconds) {
  let time = new Date(null)
  time.setSeconds(seconds)
  time = time.toISOString()
  time = (seconds > 3600)
    ? time.substr(11, 8)
    : time.substr(14, 5)
  time = (time.substr(0, 1) === '0') ? time.substring(1) : time
  return String(time)
}

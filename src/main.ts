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

import OmnitonePlayer from '../modules/omnitonePlayer.js';
import { secondsToReadableTime } from "../modules/helpers.js";

const e: {
  [index: string]: any
} = {
  // First order FuMa example
  foa: new OmnitonePlayer('sounds/foa.flac', 1,
      [0, 3, 1, 2]),

  // Second order FuMa example
  soa: new OmnitonePlayer('sounds/soa.flac', 2,
      [0, 3, 1, 2, 6, 7, 5, 8, 4]),

  // Third order ambiX example
  toa: new OmnitonePlayer('sounds/toa.flac', 3,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
};

for (const eKey in e) {

  (document.getElementById(eKey + '-initialize') as HTMLButtonElement).addEventListener('click', () => {
    e[eKey].initialize().then(() => {
      (document.getElementById(eKey + '-initialize') as HTMLButtonElement).disabled = true;
      (document.getElementById(eKey + '-load') as HTMLButtonElement).disabled = false;
    })
  });

  (document.getElementById(eKey + '-load') as HTMLButtonElement).addEventListener('click', () => {
    ((document.getElementById(eKey + '-load') as HTMLButtonElement) as HTMLButtonElement).disabled = true;
    (document.getElementById(eKey + '-load') as HTMLButtonElement).innerText = 'Loading...';
    e[eKey].load().then(() => {
      (document.getElementById(eKey + '-play') as HTMLButtonElement).disabled = false;
      (document.getElementById(eKey + '-loop') as HTMLButtonElement).disabled = false;
      (document.getElementById(eKey + '-position') as HTMLButtonElement).disabled = false;
      (document.getElementById(eKey + '-gain') as HTMLButtonElement).disabled = false;
      (document.getElementById(eKey + '-progress') as HTMLButtonElement).disabled = false;
      (document.getElementById(eKey + '-azimuth') as HTMLButtonElement).disabled = false;
      (document.getElementById(eKey + '-elevation') as HTMLButtonElement).disabled = false;
      (document.getElementById(eKey + '-load') as HTMLButtonElement).innerText = 'Loaded';
      (document.getElementById(eKey + '-duration') as HTMLButtonElement).innerText = secondsToReadableTime(e[eKey].durationInSeconds);
      (document.getElementById(eKey + '-progress') as HTMLProgressElement).max = e[eKey].durationInSeconds;
      setInterval(() => {
        (document.getElementById(
            eKey + '-progress',
        ) as HTMLProgressElement)["value"] = e[eKey].elapsedTimeInSeconds;
        (document.getElementById(
            eKey + '-current-time') as HTMLSpanElement).innerText = secondsToReadableTime(
            e[eKey].elapsedTimeInSeconds,
        )
      }, 50)
    })
  });

  (document.getElementById(eKey + '-play') as HTMLButtonElement).addEventListener('click', () => {
    e[eKey].play((document.getElementById(eKey + '-position') as HTMLButtonElement).value);
    (document.getElementById(eKey + '-stop') as HTMLButtonElement).disabled = false;
  });

  (document.getElementById(eKey + '-stop') as HTMLButtonElement).addEventListener('click', () => {
    e[eKey].stop();
    (document.getElementById(eKey + '-resume') as HTMLButtonElement).disabled = false;
    (document.getElementById(eKey + '-position') as HTMLInputElement).value = String(
        e[eKey].elapsedTimeInSeconds / e[eKey].durationInSeconds
    )
  });

  (document.getElementById(eKey + '-resume') as HTMLButtonElement).addEventListener('click', () => {
    e[eKey].resume();
    (document.getElementById(eKey + '-resume') as HTMLButtonElement).disabled = true;
  });

  (document.getElementById(eKey + '-loop') as HTMLButtonElement).addEventListener('click', () => {
    e[eKey].loop = (document.getElementById(eKey + '-loop') as HTMLInputElement).checked
  });

  (document.getElementById(eKey + '-progress') as HTMLButtonElement).addEventListener('click', function (e) {
    let percentage = (e.pageX - this.offsetLeft) / this.offsetWidth;
    (document.getElementById(eKey + '-position') as HTMLInputElement).value = String(percentage);
    (document.getElementById(eKey + '-play') as HTMLButtonElement).click();
  });

  (document.getElementById(eKey + '-gain') as HTMLInputElement).addEventListener('input', () => {
    const gain = (document.getElementById(eKey + '-gain') as HTMLInputElement).value;
    (document.getElementById(eKey + '-gain-label') as HTMLSpanElement).textContent = gain;
    e[eKey].gain = gain;
  });

  (document.getElementById(eKey + '-azimuth') as HTMLInputElement).addEventListener('input', () => {
    const azimuth = parseFloat(
        (document.getElementById(eKey + '-azimuth') as HTMLInputElement).value);
    const elevation = parseFloat(
        (document.getElementById(eKey + '-elevation') as HTMLInputElement).value);
    (document.getElementById(eKey + '-azimuth-label') as HTMLSpanElement).textContent = String(azimuth);
    (document.getElementById(eKey + '-elevation-label') as HTMLSpanElement).textContent = String(elevation);
    e[eKey].rotateSoundfield(azimuth, elevation);
  });

  (document.getElementById(eKey + '-elevation') as HTMLInputElement).addEventListener('input', () => {
    const azimuth = parseFloat(
        (document.getElementById(eKey + '-azimuth') as HTMLInputElement).value);
    const elevation = parseFloat(
        (document.getElementById(eKey + '-elevation') as HTMLInputElement).value);
    (document.getElementById(eKey + '-azimuth-label') as HTMLSpanElement).textContent = String(azimuth);
    (document.getElementById(eKey + '-elevation-label') as HTMLSpanElement).textContent = String(elevation);
    e[eKey].rotateSoundfield(azimuth, elevation);
  });

}

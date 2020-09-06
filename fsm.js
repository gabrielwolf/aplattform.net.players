import { interpret } from 'xstate';
import ambisonicsMachine from './modules/ambisonicsMachine.js';
var service = interpret(ambisonicsMachine).onTransition(function (state) { return console.log(state.value); });
service.start();
service.send("FETCH_TRACK_META");
document.querySelector('.controls__play-pause').addEventListener('click', function () {
    service.send('PLAY_PAUSE');
});
setInterval(function () { return service.send('TIMING'); }, 1000);

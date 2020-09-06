import { AnyEventObject, interpret, Interpreter, SCXML } from 'xstate/es'
import ambisonicsMachine from '../modules/ambisonicsMachine.js'

let service: Interpreter<any, any, AnyEventObject | SCXML.Event<AnyEventObject>, { value: any; context: any }>;
service = interpret(ambisonicsMachine).onTransition(state => console.log(state.value));
service.start();
service.send(`FETCH_TRACK_META`);

(document.querySelector('.controls__play-pause') as HTMLButtonElement).addEventListener('click', () => {
  service.send('PLAY_PAUSE');
});

setInterval(() => service.send('TIMING'), 1000);

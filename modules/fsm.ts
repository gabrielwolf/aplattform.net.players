import { interpret } from 'xstate'
import ambisonicsMachine from './ambisonicsMachine.js'

const service = interpret(ambisonicsMachine).onTransition(state => console.log(state.value));
service.start();
service.send(`FETCH_TRACK_META`);

(document.querySelector('.controls__play-pause') as HTMLButtonElement).addEventListener('click', () => {
  service.send('PLAY_PAUSE');
});

setInterval(() => service.send('TIMING'), 1000);

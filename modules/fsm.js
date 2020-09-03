import { interpret } from '../node_modules/xstate/dist/xstate.web.js'
import ambisonicsMachine from './ambisonicsMachine.js'

window.service = interpret(ambisonicsMachine).onTransition(state => {
  console.log(state.value)
})

window.service.start()

window.service.send('FETCH_TRACK_META')

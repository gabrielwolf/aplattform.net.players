import { interpret } from '../node_modules/xstate/dist/xstate.web.js'
import fetchMachine from './fetchMachine.js'

window.service = interpret(fetchMachine).onTransition(state => {
  console.log(state.value)
})

window.service.start()

window.service.send('FETCH_TRACK_META')

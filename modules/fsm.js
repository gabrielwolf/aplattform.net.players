import { interpret, Machine } from '../node_modules/xstate/dist/xstate.web.js'

document.getElementById('app').innerHTML = `
<h1>XState Example</h1>
<div>
  Open the <strong>Console</strong> to view the machine output.
</div>
`

// Edit your machine(s) here
const machine = Machine({
  id: 'machine',
  initial: 'inactive',
  states: {
    inactive: {
      on: { TOGGLE: 'active' },
    },
    active: {
      on: { TOGGLE: 'inactive' },
    },
  },
})

// Edit your service(s) here
const service = interpret(machine).onTransition(state => {
  console.log(state.value)
})

service.start()

service.send('TOGGLE')
service.send('TOGGLE')

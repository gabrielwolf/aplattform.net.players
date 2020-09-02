import {
  assign,
  interpret,
  Machine,
} from '../node_modules/xstate/dist/xstate.web.js'

const baseURL = 'http://127.0.0.1:5000/'
const fetchTrackMeta = () => fetch(baseURL).
  then((response) => response.json())

const fetchMachine = Machine(
  {
    id: 'fetchMachine',
    initial: 'idle',
    context: {
      trackMeta: null,
      metaRetries: 0,
    },
    states: {
      idle: {
        on: {
          FETCH_TRACK_META: 'loading',
        },
      },
      loading: {
        invoke: {
          id: 'fetchTrackMeta',
          src: fetchTrackMeta,
          onDone: {
            target: 'trackMetaLoaded',
            actions: assign({
              trackMeta: (context, event) => event.data,
            }),
          },
          onError: 'failure',
        },
      },
      failure: {
        on: {
          RETRY: {
            target: 'loading',
            actions:
              assign({
                metaRetries: (context) => context.metaRetries + 1,
              }),
          },
        },
      },
      trackMetaLoaded: {
        entry: ['displayContext'],
      },
    },
  },
  {
    actions: {
      displayContext: (context, event) => {
        console.log(context)
      },
    },
  },
)

window.service = interpret(fetchMachine).onTransition(state => {
  console.log(state.value)
})

window.service.start()

window.service.send('FETCH_TRACK_META')

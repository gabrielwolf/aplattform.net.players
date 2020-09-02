import { assign, Machine } from '../node_modules/xstate/dist/xstate.web.js'

const baseURL = 'http://127.0.0.1:5000/'
const fetchTrackMeta = () => fetch(baseURL).
  then((response) => response.json())

export default Machine(
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
        entry: ['updateTrackMeta'],
      },
    },
  },
  {
    actions: {
      updateTrackMeta: (context => {
        document.querySelector(
          '.track__time').innerText = context.trackMeta.time
        document.querySelector(
          '.track__artist').innerText = context.trackMeta.artist
        document.querySelector(
          '.track__title').innerText = context.trackMeta.title
        document.querySelector(
          '.track__composer').innerText = context.trackMeta.composer
        document.querySelector(
          '.track__member').innerText = context.trackMeta.member
        document.querySelector(
          '.track__upload').
          setAttribute('datetime', context.trackMeta.uploadTime)
        document.querySelector(
          '.track__upload').
          innerText = context.trackMeta.uploadTime
        document.querySelector(
          '.track__venue a').
          setAttribute('href', context.trackMeta.venue)
        document.querySelector(
          '.track__license').innerText = context.trackMeta.license
      }),
    },
  },
)

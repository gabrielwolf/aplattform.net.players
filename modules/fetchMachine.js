import { assign, Machine } from '../node_modules/xstate/dist/xstate.web.js'
import formatDistanceToNowStrict
  from '../node_modules/date-fns/esm/formatDistanceToNowStrict/index.js'
import parseISO from '../node_modules/date-fns/esm/parseISO/index.js'

const baseURL = 'http://127.0.0.1:5000/'
const fetchTrackMeta = () => fetch(baseURL).
  then((response) => response.json())

const limitRetries = (context) => {
  return context.metaRetries <= 3
}

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
        entry: [
          assign({
            metaRetries: (context) => context.metaRetries + 1,
          }),
          'resetTrackMeta',
          // TODO display some message and tell user
        ],
        after: {
          3000: {
            target: 'loading',
            cond: limitRetries,
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
          innerText = formatDistanceToNowStrict(
          parseISO(context.trackMeta.uploadTime))
        document.querySelector(
          '.track__venue a').
          setAttribute('href', context.trackMeta.venue)
        document.querySelector(
          '.track__license').innerText = context.trackMeta.license
      }),
      resetTrackMeta: (context => {
        document.querySelector(
          '.track__time').innerText = '00:00:00'
        document.querySelector(
          '.track__artist').innerText = 'Artist'
        document.querySelector(
          '.track__title').innerText = 'Title'
        document.querySelector(
          '.track__composer').innerText = 'Composer'
        document.querySelector(
          '.track__member').innerText = 'Member'
        document.querySelector(
          '.track__upload').
          setAttribute('datetime', '1970-01-01T00:00:00.000Z')
        document.querySelector(
          '.track__upload').
          innerText = formatDistanceToNowStrict(
          parseISO('1970-01-01T00:00:00.000Z'))
        document.querySelector(
          '.track__venue a').
          setAttribute('href', '#')
        document.querySelector(
          '.track__license').innerText = 'License'
      }),
    },
  },
)

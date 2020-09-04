import {
  assign,
  Machine,
  send,
} from '../node_modules/xstate/dist/xstate.web.js'
import formatDistanceToNowStrict
  from '../node_modules/date-fns/esm/formatDistanceToNowStrict/index.js'
import parseISO from '../node_modules/date-fns/esm/parseISO/index.js'
import OmnitonePlayer from './omnitonePlayer.js'
import { secondsToReadableTime } from './helpers.js'

const baseURL = 'http://127.0.0.1:5000/'

const fetchTrackMeta = () => fetch(baseURL).
  then((response) => response.json())

const MAX_RETRIES = 3

const maxRetriesReached = (context) => {
  return context.metaRetries > MAX_RETRIES
}

const getTrackMeta = {
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
    ],
    after: {
      1: {
        target: 'errorTrackMeta',
        cond: maxRetriesReached,
      },
      3000: {
        target: 'loading',
        cond: !maxRetriesReached,
      },
    },
  },
}

const trackReady = {
  trackReady: {
    type: 'parallel',
    states: {
      playback: {
        initial: 'paused',
        states: {
          paused: {
            entry: () => {
              document.querySelector(
                '.controls__play-pause').disabled = false
              document.querySelector(
                '.controls__play-pause').innerText = 'Play'
            },
            on: {
              PLAY_PAUSE: {
                target: 'playing',
                actions: (context) => context.track.play(
                  context.track.elapsedPercentage,
                ),
              },
            },
          },
          playing: {
            entry: () => {
              document.querySelector(
                '.controls__play-pause').innerText = 'Pause'
            },
            on: {
              PLAY_PAUSE: {
                target: 'paused',
                actions: (context) => context.track.stop(),
              },
              TIMING: {
                target: 'playing',
                actions: (context) => {
                  document.querySelector(
                    '.track__elapsed-time').innerText = secondsToReadableTime(
                    context.track.elapsedTimeInSeconds,
                  )
                },
              },
            },
          },
          ended: {},
        },
      },
      looping: {},
      gain: {},
      rotation: {},
    },
  },
}

const trackMetaLoaded = {
  trackMetaLoaded: {
    entry: [
      assign({ metaRetries: 0 }),
      'updateTrackMeta',
    ],
    exit: 'clearTrackMeta',
    initial: 'idle',
    states: {
      idle: {
        entry: send('INSTANTIATE_TRACK'),
        on: {
          INSTANTIATE_TRACK: {
            target: 'trackInstantiated',
            actions: assign({
              track: (context) => new OmnitonePlayer(context.trackMeta.src,
                context.trackMeta.order, context.trackMeta.channelMap),
            }),
          },
        },
      },
      trackInstantiated: {
        invoke: {
          id: 'initializeAmbisonics',
          src: (context) => context.track.initialize(),
          onDone: {
            target: 'audioWired',
          },
          onError: 'errorInitialisation',
        },
      },
      errorInitialisation: {
        entry: () => console.log('Initialisation Error! Please check log.'),
        type: 'final',
      },
      audioWired: {
        invoke: {
          id: 'loadTrack',
          src: (context) => context.track.load(),
          onDone: {
            target: 'trackReady',
          },
          onError: 'errorLoadTrack',
        },
      },
      errorLoadTrack: {
        entry: () => console.log('Error! Please check log.'),
        type: 'final',
      },
      ...trackReady,
    },
  },
}

const errorTrackMeta = {
  errorTrackMeta: {
    entry: () => console.log('Network Error! Please reload.'),
    type: 'final',
  },
}

export default Machine(
  {
    id: 'ambisonicsMachine',
    initial: 'idle',
    context: {
      trackMeta: null,
      track: null,
      metaRetries: 0,
    },
    states: {
      ...getTrackMeta,
      ...errorTrackMeta,
      ...trackMetaLoaded,
    },
  },
  {
    actions: {
      updateTrackMeta: (context => {
        document.querySelector(
          '.track__duration').innerText = secondsToReadableTime(
          context.trackMeta.durationInSeconds)
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
      clearTrackMeta: () => {
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
          innerText = 'Upload Time'
        document.querySelector(
          '.track__venue a').
          setAttribute('href', '#')
        document.querySelector(
          '.track__license').innerText = 'License'
      },
    },
  },
)

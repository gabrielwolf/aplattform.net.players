import { secondsToReadableTime } from './helpers';
import { assign, Machine, send } from 'xstate/lib';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import parseISO from 'date-fns/parseISO';
import OmnitonePlayer from './omnitonePlayer.js';


const baseURL = 'http://127.0.0.1:5000/';

const fetchTrackMeta = () => fetch(baseURL).then((response) => response.json());

const MAX_RETRIES = 3;

const maxRetriesReached = (context: { metaRetries: number }) => context.metaRetries > MAX_RETRIES;

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
          trackMeta: (context: any, event: { data: any }) => event.data,
        }),
      },
      onError: 'failure',
    },
  },
  failure: {
    entry: [
      assign({
        metaRetries: (context: { metaRetries: number }) => context.metaRetries + 1,
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
};

const trackReady = {
  trackReady: {
    type: 'parallel',
    states: {
      playback: {
        initial: 'paused',
        states: {
          paused: {
            entry: () => {
              (document.querySelector('.controls__play-pause') as HTMLButtonElement).disabled = false;
              (document.querySelector('.controls__play-pause') as HTMLButtonElement).innerText = 'Play';
            },
            on: {
              PLAY_PAUSE: {
                target: 'playing',
                actions: (context: { track: { play: (arg0: any) => any; elapsedPercentage: any } }) => context.track.play(context.track.elapsedPercentage),
              },
            },
          },
          playing: {
            entry: () => {
              (document.querySelector('.controls__play-pause') as HTMLButtonElement).innerText = 'Pause'
            },
            on: {
              PLAY_PAUSE: {
                target: 'paused',
                actions: (context: { track: { stop: () => any } }) => context.track.stop(),
              },
              TIMING: {
                target: 'playing',
                actions: (context: { track: { elapsedTimeInSeconds: number } }) => {
                  (document.querySelector('.track__elapsed-time') as HTMLDivElement).innerText = secondsToReadableTime(context.track.elapsedTimeInSeconds)
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
};

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
              track: ({ trackMeta }) => {
                return new OmnitonePlayer(trackMeta.src,
                    trackMeta.order, trackMeta.channelMap);
              },
            }),
          },
        },
      },
      trackInstantiated: {
        invoke: {
          id: 'initializeAmbisonics',
          src: (context: { track: { initialize: () => any } }) => context.track.initialize(),
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
          src: (context: { track: { load: () => any } }) => context.track.load(),
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
};

const errorTrackMeta = {
  errorTrackMeta: {
    entry: () => console.log('Network Error! Please reload.'),
    type: 'final',
  },
};

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
        updateTrackMeta: (context: { trackMeta: { durationInSeconds: number; artist: any; title: any; composer: any; member: any; uploadTime: string; venue: string; license: any } }) => {
          (document.querySelector('.track__duration') as HTMLDivElement).innerText = secondsToReadableTime(context.trackMeta.durationInSeconds);
          (document.querySelector('.track__artist') as HTMLDivElement).innerText = context.trackMeta.artist;
          (document.querySelector('.track__title') as HTMLDivElement).innerText = context.trackMeta.title;
          (document.querySelector('.track__composer') as HTMLDivElement).innerText = context.trackMeta.composer;
          (document.querySelector('.track__member') as HTMLDivElement).innerText = context.trackMeta.member;
          (document.querySelector('.track__upload') as HTMLDivElement).setAttribute('datetime', context.trackMeta.uploadTime);
          (document.querySelector('.track__upload') as HTMLDivElement).innerText = formatDistanceToNowStrict(parseISO(context.trackMeta.uploadTime));
          (document.querySelector('.track__venue a') as HTMLDivElement).setAttribute('href', context.trackMeta.venue);
          (document.querySelector('.track__license') as HTMLDivElement).innerText = context.trackMeta.license;
        },
        clearTrackMeta: () => {
          (document.querySelector('.track__time') as HTMLDivElement).innerText = '0:00';
          (document.querySelector('.track__artist') as HTMLDivElement).innerText = 'Artist';
          (document.querySelector('.track__title') as HTMLDivElement).innerText = 'Title';
          (document.querySelector('.track__composer') as HTMLDivElement).innerText = 'Composer';
          (document.querySelector('.track__member') as HTMLDivElement).innerText = 'Member';
          (document.querySelector('.track__upload') as HTMLTimeElement).setAttribute('datetime', '1970-01-01T00:00:00.000Z');
          (document.querySelector('.track__upload') as HTMLTimeElement).innerText = 'Upload Time';
          (document.querySelector('.track__venue a') as HTMLDivElement).setAttribute('href', '#');
          (document.querySelector('.track__license') as HTMLDivElement).innerText = 'License';
        },
      },
    },
);

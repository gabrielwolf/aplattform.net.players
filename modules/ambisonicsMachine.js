var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { secondsToReadableTime } from './helpers';
import { assign, Machine, send } from 'xstate/es';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import parseISO from 'date-fns/parseISO';
import OmnitonePlayer from './omnitonePlayer.js';
var baseURL = 'http://127.0.0.1:5000/';
var fetchTrackMeta = function () { return fetch(baseURL).then(function (response) { return response.json(); }); };
var MAX_RETRIES = 3;
var maxRetriesReached = function (context) { return context.metaRetries > MAX_RETRIES; };
var getTrackMeta = {
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
                    trackMeta: function (context, event) { return event.data; },
                }),
            },
            onError: 'failure',
        },
    },
    failure: {
        entry: [
            assign({
                metaRetries: function (context) { return context.metaRetries + 1; },
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
var trackReady = {
    trackReady: {
        type: 'parallel',
        states: {
            playback: {
                initial: 'paused',
                states: {
                    paused: {
                        entry: function () {
                            document.querySelector('.controls__play-pause').disabled = false;
                            document.querySelector('.controls__play-pause').innerText = 'Play';
                        },
                        on: {
                            PLAY_PAUSE: {
                                target: 'playing',
                                actions: function (context) { return context.track.play(context.track.elapsedPercentage); },
                            },
                        },
                    },
                    playing: {
                        entry: function () {
                            document.querySelector('.controls__play-pause').innerText = 'Pause';
                        },
                        on: {
                            PLAY_PAUSE: {
                                target: 'paused',
                                actions: function (context) { return context.track.stop(); },
                            },
                            TIMING: {
                                target: 'playing',
                                actions: function (context) {
                                    document.querySelector('.track__elapsed-time').innerText = secondsToReadableTime(context.track.elapsedTimeInSeconds);
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
var trackMetaLoaded = {
    trackMetaLoaded: {
        entry: [
            assign({ metaRetries: 0 }),
            'updateTrackMeta',
        ],
        exit: 'clearTrackMeta',
        initial: 'idle',
        states: __assign({ idle: {
                entry: send('INSTANTIATE_TRACK'),
                on: {
                    INSTANTIATE_TRACK: {
                        target: 'trackInstantiated',
                        actions: assign({
                            track: function (_a) {
                                var trackMeta = _a.trackMeta;
                                return new OmnitonePlayer(trackMeta.src, trackMeta.order, trackMeta.channelMap);
                            },
                        }),
                    },
                },
            }, trackInstantiated: {
                invoke: {
                    id: 'initializeAmbisonics',
                    src: function (context) { return context.track.initialize(); },
                    onDone: {
                        target: 'audioWired',
                    },
                    onError: 'errorInitialisation',
                },
            }, errorInitialisation: {
                entry: function () { return console.log('Initialisation Error! Please check log.'); },
                type: 'final',
            }, audioWired: {
                invoke: {
                    id: 'loadTrack',
                    src: function (context) { return context.track.load(); },
                    onDone: {
                        target: 'trackReady',
                    },
                    onError: 'errorLoadTrack',
                },
            }, errorLoadTrack: {
                entry: function () { return console.log('Error! Please check log.'); },
                type: 'final',
            } }, trackReady),
    },
};
var errorTrackMeta = {
    errorTrackMeta: {
        entry: function () { return console.log('Network Error! Please reload.'); },
        type: 'final',
    },
};
var ambisonicsMachine;
ambisonicsMachine = Machine({
    id: 'ambisonicsMachine',
    initial: 'idle',
    context: {
        trackMeta: null,
        track: null,
        metaRetries: 0,
    },
    states: __assign(__assign(__assign({}, getTrackMeta), errorTrackMeta), trackMetaLoaded),
}, {
    actions: {
        updateTrackMeta: function (context) {
            document.querySelector('.track__duration').innerText = secondsToReadableTime(context.trackMeta.durationInSeconds);
            document.querySelector('.track__artist').innerText = context.trackMeta.artist;
            document.querySelector('.track__title').innerText = context.trackMeta.title;
            document.querySelector('.track__composer').innerText = context.trackMeta.composer;
            document.querySelector('.track__member').innerText = context.trackMeta.member;
            document.querySelector('.track__upload').setAttribute('datetime', context.trackMeta.uploadTime);
            document.querySelector('.track__upload').innerText = formatDistanceToNowStrict(parseISO(context.trackMeta.uploadTime));
            document.querySelector('.track__venue a').setAttribute('href', context.trackMeta.venue);
            document.querySelector('.track__license').innerText = context.trackMeta.license;
        },
        clearTrackMeta: function () {
            document.querySelector('.track__time').innerText = '0:00';
            document.querySelector('.track__artist').innerText = 'Artist';
            document.querySelector('.track__title').innerText = 'Title';
            document.querySelector('.track__composer').innerText = 'Composer';
            document.querySelector('.track__member').innerText = 'Member';
            document.querySelector('.track__upload').setAttribute('datetime', '1970-01-01T00:00:00.000Z');
            document.querySelector('.track__upload').innerText = 'Upload Time';
            document.querySelector('.track__venue a').setAttribute('href', '#');
            document.querySelector('.track__license').innerText = 'License';
        },
    },
});
export default ambisonicsMachine;

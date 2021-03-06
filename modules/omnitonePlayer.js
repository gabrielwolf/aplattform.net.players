//  Generic Ambisonics Player Classes
//    Copyright (C) 2020 Gabriel Wolf <gabriel.wolf@posteo.de>
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as published
//    by the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// @ts-ignore
import Omnitone from '../node_modules/omnitone/build/omnitone.esm.js';
var OmnitonePlayer = /** @class */ (function () {
    function OmnitonePlayer(src, order, channelMap) {
        this._src = src;
        this._order = order;
        this._channelMap = channelMap;
        this._playbackStartedAtTimeInMilliseconds = 0;
        this._playedFromPosition = .0;
        this._elapsedTimeInMilliSeconds = 0;
        this._offset = 0;
        this._calcElapsedHandler = 0;
        this._durationInSeconds = 0;
        this._loop = false;
    }
    Object.defineProperty(OmnitonePlayer.prototype, "loop", {
        get: function () {
            return this._loop;
        },
        set: function (value) {
            this._loop = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OmnitonePlayer.prototype, "durationInSeconds", {
        get: function () {
            return this._durationInSeconds;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OmnitonePlayer.prototype, "elapsedPercentage", {
        get: function () {
            return (this.durationInSeconds === 0)
                ? 0
                : (this._elapsedTimeInMilliSeconds / 1000) / this.durationInSeconds;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OmnitonePlayer.prototype, "elapsedTimeInSeconds", {
        get: function () {
            return this._elapsedTimeInMilliSeconds / 1000;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OmnitonePlayer.prototype, "gain", {
        set: function (gain) {
            this._inputGain.gain.exponentialRampToValueAtTime(Math.pow(10, parseFloat(gain) / 20), this._audioContext.currentTime + 0.2);
        },
        enumerable: false,
        configurable: true
    });
    OmnitonePlayer.crossProduct = function (a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0],
        ];
    };
    OmnitonePlayer.getListOfFileNames = function (src, order) {
        if (!src.indexOf('.'))
            Error("Filename has no extension!");
        var file = src.split('.');
        var extension = file.pop();
        var listOfFileNames = [], postfix = [];
        switch (order) {
            case 1:
                postfix = [''];
                break;
            case 2:
                postfix = ['_ch0-7', '_ch8'];
                break;
            case 3:
                postfix = ['_ch0-7', '_ch8-15'];
                break;
        }
        postfix.forEach(function (item) {
            listOfFileNames.push(src.substring(0, src.length - extension.length - 1)
                + item
                + '.' + src.split('.').pop());
        });
        return listOfFileNames;
    };
    OmnitonePlayer.normalize = function (a) {
        var n = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
        a[0] /= n;
        a[1] /= n;
        a[2] /= n;
        return a;
    };
    // ---------------- Helpers ----------------
    OmnitonePlayer.prototype.rotateSoundfield = function (azimuth, elevation) {
        var rotationMatrix3 = new Float32Array(9);
        var theta = azimuth / 180 * Math.PI;
        var phi = elevation / 180 * Math.PI;
        var forward = [
            Math.sin(theta) * Math.cos(phi),
            Math.sin(phi),
            Math.cos(theta) * Math.cos(phi),
        ];
        var upInitial = [0, 1, 0];
        var right = OmnitonePlayer.normalize(OmnitonePlayer.crossProduct(forward, upInitial));
        var up = OmnitonePlayer.normalize(OmnitonePlayer.crossProduct(right, forward));
        rotationMatrix3[0] = right[0];
        rotationMatrix3[1] = right[1];
        rotationMatrix3[2] = right[2];
        rotationMatrix3[3] = up[0];
        rotationMatrix3[4] = up[1];
        rotationMatrix3[5] = up[2];
        rotationMatrix3[6] = forward[0];
        rotationMatrix3[7] = forward[1];
        rotationMatrix3[8] = forward[2];
        this._ambisonicsRenderer.setRotationMatrix3(rotationMatrix3);
    };
    OmnitonePlayer.prototype.finalizeLoading = function () {
        this.rotateSoundfield(0, 0);
        this._durationInSeconds = this._contentBuffer.length / this._contentBuffer.sampleRate;
    };
    OmnitonePlayer.prototype.clearCurrentBufferSource = function () {
        this._currentBufferSource.stop();
        this._currentBufferSource.disconnect();
    };
    OmnitonePlayer.prototype.updateElapsedTimeInMilliSeconds = function () {
        this._offset = this._playedFromPosition * this._durationInSeconds * 1000;
        this._elapsedTimeInMilliSeconds = Date.now() - this._playbackStartedAtTimeInMilliseconds + this._offset;
    };
    // ---------------- Main functions ----------------
    OmnitonePlayer.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this._audioContext = new AudioContext();
                        this._inputGain = this._audioContext.createGain();
                        if (!(this._order === 1)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, Omnitone.createFOARenderer(this._audioContext, { channelMap: this._channelMap })];
                    case 1:
                        _a._ambisonicsRenderer = _c.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(this._order > 1)) return [3 /*break*/, 4];
                        _b = this;
                        return [4 /*yield*/, Omnitone.createHOARenderer(this._audioContext, { channelMap: this._channelMap, ambisonicOrder: this._order })];
                    case 3:
                        _b._ambisonicsRenderer = _c.sent();
                        _c.label = 4;
                    case 4:
                        this._ambisonicsRenderer.initialize();
                        this._inputGain.connect(this._ambisonicsRenderer.input);
                        this._ambisonicsRenderer.output.connect(this._audioContext.destination);
                        return [2 /*return*/];
                }
            });
        });
    };
    OmnitonePlayer.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, _a, results, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this._order === 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Omnitone.createBufferList(this._audioContext, [this._src])];
                    case 1:
                        results = _c.sent();
                        _a = this;
                        return [4 /*yield*/, Omnitone.mergeBufferListByChannel(this._audioContext, results)];
                    case 2:
                        _a._contentBuffer = _c.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(this._order === 2 || this._order === 3)) return [3 /*break*/, 6];
                        return [4 /*yield*/, Omnitone.createBufferList(this._audioContext, [
                                OmnitonePlayer.getListOfFileNames(this._src, this._order)[0],
                                OmnitonePlayer.getListOfFileNames(this._src, this._order)[1],
                            ])];
                    case 4:
                        results = _c.sent();
                        _b = this;
                        return [4 /*yield*/, Omnitone.mergeBufferListByChannel(this._audioContext, results)];
                    case 5:
                        _b._contentBuffer = _c.sent();
                        _c.label = 6;
                    case 6:
                        this.finalizeLoading();
                        return [2 /*return*/];
                }
            });
        });
    };
    OmnitonePlayer.prototype.play = function (from) {
        var _this = this;
        if (this._currentBufferSource) {
            this.clearCurrentBufferSource();
        }
        this._currentBufferSource = this._audioContext.createBufferSource();
        this._currentBufferSource.buffer = this._contentBuffer;
        this._currentBufferSource.loop = false;
        this._currentBufferSource.connect(this._inputGain);
        this._playbackStartedAtTimeInMilliseconds = Date.now();
        this._playedFromPosition = from;
        if (this._calcElapsedHandler)
            clearInterval(this._calcElapsedHandler);
        this._calcElapsedHandler = setInterval(function () { return _this.updateElapsedTimeInMilliSeconds(); }, 10);
        this._currentBufferSource.start(0, from * this._durationInSeconds);
        if (this._order === 1)
            console.log('FOAPlayer playing...');
        else if (this._order === 2 || this._order === 3)
            console.log('HOAPlayer playing...');
        this._currentBufferSource.onended = function () {
            var lastChanceToStopBeforeEndOfSongInSeconds = 1;
            if (Math.abs(_this._durationInSeconds - _this.elapsedTimeInSeconds) < lastChanceToStopBeforeEndOfSongInSeconds) {
                clearInterval(_this._calcElapsedHandler);
                _this._playedFromPosition = .0;
                _this._elapsedTimeInMilliSeconds = 0;
                if (_this._loop) {
                    _this.play(0);
                }
            }
        };
    };
    OmnitonePlayer.prototype.stop = function () {
        if (this._currentBufferSource) {
            clearInterval(this._calcElapsedHandler);
            this.clearCurrentBufferSource();
        }
    };
    OmnitonePlayer.prototype.resume = function () {
        this.play((this._elapsedTimeInMilliSeconds / 1000) / this._durationInSeconds);
    };
    return OmnitonePlayer;
}());
export default OmnitonePlayer;

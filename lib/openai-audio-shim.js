"use strict";
// Shim: prevents Parcel scope-hoisting from declaring 'Audio' in bundle global scope,
// which conflicts with the browser's built-in Audio constructor.
// ScoutCurate does not use the OpenAI Audio API.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audio = void 0;
exports.Transcriptions = void 0;
exports.Speech = void 0;
exports.Translations = void 0;

function AudioShim() {}
AudioShim.Transcriptions = function () {};
AudioShim.Speech = function () {};
AudioShim.Translations = function () {};

exports.Audio = AudioShim;
exports.Transcriptions = function () {};
exports.Speech = function () {};
exports.Translations = function () {};

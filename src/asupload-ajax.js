/*
 * asyncupload.js
 * https://github.com/damianpolak/asyncupload.js
 *
 * Copyright 2017, Damian Polak
 * lib used: Bootstrap 4.0.0, superbytes.js
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 */

module.exports = ajax = () => {
  'use strict';
  return {
    send: (url, data, eventListeners) => {

      let xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);

      eventListeners(xhr);

      xhr.upload.addEventListener('error', () => {
        console.log('TRANSFER FAILED!');
      }, false);

      xhr.upload.addEventListener('abort', () => {
        console.log('TRANSFER CANCELED!');
      }, false);

      xhr.send(data);
    }
  };
};

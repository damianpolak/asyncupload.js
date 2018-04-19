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
    send: (url, data, additional) => {

      let xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);

      xhr.upload.addEventListener('progress', e => {
        additional(e);
      }, false);

      xhr.upload.addEventListener("error", () => {
        console.log('TRANSFER FAILED!');
      }, false);

      xhr.upload.addEventListener("abort", () => {
        console.log('TRANSFER CANCELED!');
      }, false);

      xhr.upload.addEventListener("loadend", () => {
        console.log('The transfer finished (although we dont know if it succeeded or not).');
      }, false);

      xhr.onreadystatechange = function() {
          if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
              // Action for success
              console.log('success');
          }
      }
      xhr.send(data);
    }
  };
};

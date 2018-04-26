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

module.exports = pattern = () => {
  'use strict';
  const input = {
    name: 'userfile[]',
    type: 'file',
    id: '_asInp-FileItem-'
  };

  const list = {
    id: '_asLi-FileItem-',
    class: 'test list-group-item align-middle'
  };

  const progress = {
    wrapperId: '_asLi-ProgressBar',
    barId: '_asDiv-ProgressBar',
    infoId: '_asP-ProgressInfo'
  };

  const dropzone = {
    id: 'scrollZone'
  };

  return {
    input: input,
    list: list,
    dropzone: dropzone,
    progress: progress
  };

};

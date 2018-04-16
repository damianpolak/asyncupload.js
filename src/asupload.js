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

const as_proc = require('./asupload-proc.js');
const as_patt = require('./asupload-pattern.js');
const as_ui = require('./asupload-ui.js');

const proc = as_proc();
const pattern = as_patt();
const ui = as_ui();

(() => {
  'use strict';

  // Buttons id
  const idBtnAddFiles = '_asBtn-AddFiles';
  const idBtnSendFiles = '_asBtn-SendFiles';
    const idBtnSendFilesWrapper = '_asLi-SendFiles';
  const idBtnRemFile = '_asI-FileItem-Rem-';

  // Places id
  const idFrmInputs = '_asFrm-InputFiles';
  const idUlListFiles = '_asUl-ListFiles';
  const idSpanFileName = '_as-FileItem-Name-';

  let elBtnAddFiles = document.getElementById(idBtnAddFiles);
  let elBtnSendFiles = document.getElementById(idBtnSendFiles);

  // Main container - document ready
  document.addEventListener('DOMContentLoaded', () => {

    // Click event add files, triggers input click
    elBtnAddFiles.addEventListener('click', (e) => {
      addClick(e);
    });

    // Click event send files
    elBtnSendFiles.addEventListener('click', (e) => {
      e.preventDefault();
      ui.progress.show();
      // Hide Send Button
      document.getElementById(idBtnSendFilesWrapper).setAttribute('style', 'display: none');
      sendClick(e);
    });

  });

  // Function body for event adding files click
  let addClick = (e) => {
    ui.input.add(idFrmInputs);

    const currInput = `${pattern.input.id}${ui.input.value()}`;
    let element = document.getElementById(currInput);
    element.click();

    // EVENT CHANGE INPUT FILES
    element.addEventListener('change', (e) => {
      inputChange(e);
    });
  }

  let inputChange = (e) => {
    let files = e.target.files;
    for(let i = 0; i <= files.length-1; i++)
      if(proc.upload.files.add (files[i])) {
        proc.upload.files.inc();

        let fileCount = proc.upload.files.getCount();
        ui.list.add(files[i], fileCount, idUlListFiles);

        document.getElementById(`${idBtnRemFile}${fileCount}`).addEventListener('click', (e) => {
          console.log(`Clicked: ${e.target.id}`);

          removeClick(e);
        })
      }
  }

  let removeClick = (e) => {
    let res = e.target.id.split('-');
    let index = res[res.length-1];

    let elem = document.getElementById(`${idSpanFileName}${index}`);
    console.log(`value elem: ${elem.innerText}`);
    if(proc.upload.files.remove(elem.innerText)) {
      ui.list.remove (e.target.id);
      console.log(proc.upload.files.list());
    }
  }

  let sendClick = (e) => {
    let ar = ui.input.getAll();
    console.log(`SEND FILES: ${ar.length}`);
    let c = ui.input.value();
    console.log(`SEND INPUTS: ${c}`);
    let objInputs = [];

    for(let i = 1; i <= c; i++)
      objInputs.push(document.getElementById(`${pattern.input.id}${i}`));

    proc.upload.send('server/upload.php', proc.upload.prepare(objInputs), e => {

      var percentComplete = e.loaded / e.total;

      percentComplete = parseInt(percentComplete * 100);

        ui.progress.inc(percentComplete, e.loaded, e.total);
        console.log(`TARGET: ${e.target}`);
      if (percentComplete === 100) {

      }
    });

  }
})();

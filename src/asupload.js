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

    // DROP ZONE TESTS - PROTOTYPE

    document.getElementById('scrollZone').addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('File(s) dropped');

      /*
      if(e.dataTransfer.files) {
        console.log('datatransfer files');

        for (var i = 0; i < e.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
        }
        console.log(e.dataTransfer.files);
      }

      let files = e.dataTransfer.files;
      for(let i = 0; i <= files.length-1; i++)
        if(proc.upload.files.add (files[i])) {
          proc.upload.files.inc();
          toggleDragArea('dropText');
          console.log(`Files count: ${proc.upload.files.getCount()}`);
          let fileCourse = proc.upload.files.getCourse();
          ui.list.add(files[i], i, idUlListFiles);

          document.getElementById(`${idBtnRemFile}${fileCourse}`).addEventListener('click', (e) => {

            removeClick(e);
            toggleDragArea('dropText');
          })
        }
        console.log(proc.upload.files);*/

    });

    document.getElementById('scrollZone').addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("In Drop Zone");

    });

    document.getElementById('scrollZone').addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Drag Leave');

    });

    // DROP ZONE END
  });

  let toggleDragArea = (elementId) => {
    if(proc.upload.files.getCount() == 0) {
      document.getElementById(elementId).setAttribute('style', 'display: flex');
    } else {
      document.getElementById(elementId).setAttribute('style', 'display: none');
    }
  }
  // Function body for event adding files click
  let addClick = (e) => {
    ui.input.add(idFrmInputs);

    const currInput = `${pattern.input.id}${ui.input.value()}`;
    let element = document.getElementById(currInput);
    element.click();

    // EVENT CHANGE INPUT FILES
    element.addEventListener('change', (e) => {
      inputChange(e);
      toggleDragArea('dropText');

      console.log('Get All:');
      console.log(ui.input.getAll());
    });
  }

  let inputChange = (e) => {
    let files = e.target.files;
    for(let i = 0; i <= files.length-1; i++)
      if(proc.upload.files.add (files[i])) {
        proc.upload.files.inc();

        let fileCourse = proc.upload.files.getCourse();
        ui.list.add(files[i], fileCourse, idUlListFiles);

        document.getElementById(`${idBtnRemFile}${fileCourse}`).addEventListener('click', (e) => {

          removeClick(e);
          toggleDragArea('dropText');
        })
      }
  }

  let removeClick = (e) => {
    let res = e.target.id.split('-');
    let index = res[res.length-1];

    let elem = document.getElementById(`${idSpanFileName}${index}`);
    if(proc.upload.files.remove(elem.innerText)) {
      ui.list.remove (e.target.id);
    }
  }

  let sendClick = (e) => {
    let ar = ui.input.getAll();
    let c = ui.input.value();
    let objInputs = [];

    for(let i = 1; i <= c; i++)
      objInputs.push(document.getElementById(`${pattern.input.id}${i}`));

      proc.upload.send('server/upload.php', proc.upload.prepare(objInputs), e => {
        if (e.lengthComputable) {
          let percentComplete = e.loaded / e.total;
          percentComplete = parseInt(percentComplete * 100);
          ui.progress.inc(percentComplete, e.loaded, e.total);
          if (percentComplete === 100) {

          }
        }
      });
  }
})();

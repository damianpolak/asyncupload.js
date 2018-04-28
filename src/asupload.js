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

  var dropData = new FormData();

  // Main container - document ready
  document.addEventListener('DOMContentLoaded', () => {

    // Click event add files, triggers input click
    elBtnAddFiles.addEventListener('click', (e) => {
      addClick(e);
    });

    // Click event send files
    elBtnSendFiles.addEventListener('click', (e) => {
      e.preventDefault();

      // Button send is notactive when no files selected
      if(proc.upload.files.getCount() > 0) {
        // Hide ScrollZone when uploading
        document.getElementById('scrollZone').setAttribute('style', 'display: none;');
        document.getElementById('headTextBegin').setAttribute('style', 'display: none;');
        document.getElementById('headTextProcess').setAttribute('style', 'display: block;');
        document.getElementById('headTextProcess').innerHTML = 'Uploading...<br>It may take a while';
        ui.progress.show();
        // Hide Send Button
        document.getElementById(idBtnSendFilesWrapper).setAttribute('style', 'display: none');
        sendClick(e);
      }

    });

    // DROP ZONE TESTS - PROTOTYPE

    document.getElementById(pattern.dropzone.id).addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();


      addElementList(e.dataTransfer.files);
      for(let i = 0; i <= e.dataTransfer.files.length; i++) {
        dropData.append('userfile[]', e.dataTransfer.files[i]);
      }

      if(e.dataTransfer.files.length == 0) {
        toggleDragArea('dropText');
      } else {
        toggleDragArea('dropText');
      }
    });

    document.getElementById(pattern.dropzone.id).addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      //console.log("In Drop Zone");

    });

    document.getElementById(pattern.dropzone.id).addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      //console.log('Drag Leave');

    });

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
      addElementList(e.target.files);
      toggleDragArea('dropText');

    });
  }

  let addElementList = (filesObject) => {

    if(proc.upload.files.getCount() === 0) {
      document.getElementById('filesInfo').setAttribute('style', 'display: block;');
    }

    let files = filesObject;
    for(let i = 0; i <= files.length-1; i++)
      if(proc.upload.files.add (files[i])) {
        proc.upload.files.inc();

        let fileCourse = proc.upload.files.getCourse();
        ui.list.add(files[i], fileCourse, idUlListFiles);

        document.getElementById(`${idBtnRemFile}${fileCourse}`).addEventListener('click', (e) => {

          removeElementList(e);
          toggleDragArea('dropText');
        })
      }

    document.getElementById('filesCountInfo').innerHTML = proc.upload.files.getCount() + '/20';
    document.getElementById('filesSizeInfo').innerHTML = `${superbytes(proc.upload.files.getSize())}/20GB`;

  }

  let removeElementList = (e) => {

    let res = e.target.id.split('-');
    let index = res[res.length-1];

    let elem = document.getElementById(`${idSpanFileName}${index}`);
    if(proc.upload.files.remove(elem.innerText)) {
      ui.list.remove (e.target.id);
    }

    if(proc.upload.files.getCount() === 0) {
      document.getElementById('filesInfo').setAttribute('style', 'display: none;');
    }

    document.getElementById('filesCountInfo').innerHTML = `${proc.upload.files.getCount()}/20`
    document.getElementById('filesSizeInfo').innerHTML = `${superbytes(proc.upload.files.getSize())}/20GB`;
  }

  let sendClick = (e) => {
    let ar = ui.input.getAll();
    let c = ui.input.value();
    let inputObjects = [];

    for(let i = 1; i <= c; i++) {
      // Add input elements to object array
      inputObjects.push(document.getElementById(`${pattern.input.id}${i}`));
    }

    // Method for send files from both drop and input objects
    proc.upload.send('server/upload.php', proc.upload.prepare(inputObjects, dropData.getAll('userfile[]')), xhr => {
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          let percentComplete = e.loaded / e.total;
          percentComplete = parseInt(percentComplete * 100);
          ui.progress.inc(percentComplete, e.loaded, e.total);

          if(percentComplete === 100) {
            document.getElementById('headTextProcess').innerHTML = 'Preparing files...<br>Everything is almost done... ';
          }
        }
      }, false);

      xhr.onreadystatechange = function() {
          if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
              // Action for success
              console.log('success');
              console.log(xhr.response);

              // Show message in header when all files
              document.getElementById('headTextProcess').innerHTML = 'Successul!<br>All files were uploaded! ';
          }
      };

      xhr.upload.addEventListener('loadstart', e => {

      }, false);
    });

  }
})();

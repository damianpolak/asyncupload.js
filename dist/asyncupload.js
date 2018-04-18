(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

      xhr.onreadystatechange = function() {
          if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
              // Action for success
          }
      }
      xhr.send(data);
    }
  };
};

},{}],2:[function(require,module,exports){
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

  return {
    input: input,
    list: list,
    progress: progress
  };

};

},{}],3:[function(require,module,exports){
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
const a = require('./asupload-ajax.js');
const ajax = a();

module.exports = proc = () => {
  'use strict';
  let upload = (() => {
    let dataForTheServer = new FormData();

    let prepare = (dataInputs) => {
      let inpCount = dataInputs.length;
      for(let i = 1; i <= inpCount; i++) {
        let n = dataInputs[i-1].files.length;
        for(let j = 0; j <= n - 1; j++) {
          let file = dataInputs[i-1].files[j];
          let d = dataForTheServer.getAll('userfile[]');
          if(!d.find(x => x.name === file.name)) {
            if(files.list().find(x => x.name === file.name))
              dataForTheServer.append('userfile[]', file);
          }
        }
      }
      dataForTheServer.append('approvedFiles', JSON.stringify(files.list()));
      return dataForTheServer;
    }

    let send = (ajaxUrl, ajaxData, progress) => {
      ajax.send(ajaxUrl, ajaxData, progress);
    }

    let files = (() => {
      let approved = [];
      let course = 0;
      let count = 0;

      let add = (item) => {
        let result = approved.find(x => x.name === item.name);
        if(result == undefined) {
          approved.push( {
            'name':item.name,
            'type':item.type,
            'size':item.size
          });
          return true;
        } else {
          console.log('Plik już istnieje!');
          return false;
        }
      }

      let remove = (item) => {
        let index = approved.findIndex(x => x.name == item);
        if(!(index < 0)) {
          approved.splice(index, 1);
          count--;
          return true
        } else {
          return false;
        }

      }

      return {
        add: add,
        remove: remove,
        list: () => {
          return approved;
        },
        inc: () => {
          course++;
          count++;
        },
        getCount: () => {
          return count;
        },
        getCourse: () => {
          return course;
        }
      };
    })();

    return {
      send: send,
      files: files,
      getData: () => {
        return dataForTheServer;
      },
      prepare: prepare
    }
  })();

  return {
    upload: upload
  }
};

},{"./asupload-ajax.js":1}],4:[function(require,module,exports){
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

const as_patt = require('./asupload-pattern.js');
const superbytes = require('./superbytes.js');
const pattern = as_patt();

module.exports = ui = () => {
  'use strict';
  let input = (() => {

    let count = 0;

    return {
      add: (place) => {
        // increment quantity of inputs
        input.inc();

        let element = document.createElement('input');
          element.setAttribute('name', pattern.input.name);
          element.setAttribute('type', pattern.input.type);
          element.setAttribute('id', `${pattern.input.id}${input.value()}`);
          element.setAttribute('hidden', 'hidden');
          element.setAttribute('multiple', 'multiple');
        document.getElementById(place).appendChild(element);
      },
      inc: () => {
        count++;
      },
      value: () => {
        return count;
      },
      getAll: () => {
        let objArray = [];
        for(let i = 1; i <= input.value(); i++) {
          let n = document.getElementById(`${pattern.input.id}${i}`).files.length;
          for(let j = 0; j <= n - 1; j++) {
            objArray.push(document.getElementById(`${pattern.input.id}${i}`).files[j]);
          }
        }
        return objArray;
      },
      pattern: pattern

    };
  })();

  let list = (() => {

    return {
      add: (item, index, place) => {
        let element = document.createElement('li');
          element.setAttribute('class', pattern.list.class);
          element.setAttribute('id', `${pattern.list.id}${index}`);
        document.getElementById(place).appendChild(element);

        let elementDivFile = document.createElement('div');
          elementDivFile.setAttribute('class', 'itemTextTrunc');
        document.getElementById(`${pattern.list.id}${index}`).appendChild(elementDivFile);

        let elementSpanFile = document.createElement('span');
          elementSpanFile.setAttribute('id', `_as-FileItem-Name-${index}`);
        elementDivFile.appendChild(elementSpanFile);
        elementSpanFile.innerHTML = item.name;

        let elementDivFileInfo = document.createElement('div');
          elementDivFileInfo.setAttribute('class', '_asDiv-ItemInfo');
        elementDivFile.appendChild(elementDivFileInfo);
        elementDivFileInfo.innerHTML = `Size: ${superbytes(item.size)} | Type: ${item.type}`;

        let elementDivRemoveButton = document.createElement('div');
          elementDivRemoveButton.setAttribute('class', 'itemRemoveButton');
        element.appendChild(elementDivRemoveButton);

        let elementIBtn = document.createElement('i');
          elementIBtn.setAttribute('class', 'btn-act fa fa-times text-primary');
          elementIBtn.setAttribute('id', `_asI-FileItem-Rem-${index}`);
        elementDivRemoveButton.appendChild(elementIBtn);

      },
      remove: (id) => {
        let res = id.split('-');
        let index = res[res.length-1];
        document.getElementById(`${pattern.list.id}${index}`).setAttribute('style', 'display: none;');
      }
    };
  })();

  let progress = (() => {
    return {
      show: () => {
        document.getElementById(pattern.progress.wrapperId).setAttribute('style', 'display: block;');
      },
      inc: (value, loaded, total) => {
        document.getElementById(pattern.progress.barId).setAttribute('style', `width: ${value}%`);
        document.getElementById(pattern.progress.barId).setAttribute('aria-valuenow', `${value}`);
        document.getElementById(pattern.progress.infoId).innerHTML = `${value}% | ${superbytes(loaded)}/${superbytes(total)}`;
      }
    }
  })();

  return {
    input: input,
    list: list,
    progress: progress
  };
};

},{"./asupload-pattern.js":2,"./superbytes.js":6}],5:[function(require,module,exports){
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

  let toggleDragArea = (e) => {
    if(proc.upload.files.getCount() == 0) {
      document.getElementById('drag-area').setAttribute('style', 'display: flex');
    } else {
      document.getElementById('drag-area').setAttribute('style', 'display: none');
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
      toggleDragArea(e);
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
          toggleDragArea(e);
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

},{"./asupload-pattern.js":2,"./asupload-proc.js":3,"./asupload-ui.js":4}],6:[function(require,module,exports){
/*
 * superbytes.js
 * https://github.com/damianpolak/superbytes.js
 *
 * Copyright 2018, Damian Polak
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 */

// Usage: superbytes(bytes, arg1, arg2)
// bytes : number value in bytes
// arg1 : SI metric system or traditional (true or false, default is false traditional 1024^n)
// arg2 : decimal number after point (default is 2)
// You can use arg1 and arg2 interchangeably

module.exports = superbytes = (bytes, arg1, arg2) => {
   'use strict';

   const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   bytes = Math.abs(bytes);
   let divider,
       si,
       digits = 0;

   if((arg1 === undefined) && (arg2 === undefined)) {
     divider = 1024;
     digits = 2;
   }
   if(typeof arg1 === 'boolean') {
     if(arg1) {
       divider = 1000;
     } else {
       divider = 1024;
     }
     if(typeof arg2 === 'number') {
       digits = arg2;
     } else {
       digits = 2;
     }
   } else if(typeof arg1 === 'number') {
     digits = arg1;
     if(typeof arg2 === 'boolean') {
       if(arg2) {
         divider = 1000;
       } else {
         divider = 1024;
       }
     } else {
       divider = 1024;
     }
   }

   if(Number.isFinite(bytes)) {
     if(bytes < divider) {
       let num = bytes;
       return `${num} ${UNITS[0]}`;
     }

     for(let i = 1; i <= 8; i++) {
       if(bytes >= Math.pow(divider, i) && bytes < Math.pow(divider, i+1)) {
         let num = (bytes/Math.pow(divider, i)).toFixed(digits);
         return `${num} ${UNITS[i]}`;
       }
     }
   }
 };

},{}]},{},[5]);

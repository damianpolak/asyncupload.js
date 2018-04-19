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

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXN1cGxvYWQtYWpheC5qcyIsInNyYy9hc3VwbG9hZC1wYXR0ZXJuLmpzIiwic3JjL2FzdXBsb2FkLXByb2MuanMiLCJzcmMvYXN1cGxvYWQtdWkuanMiLCJzcmMvYXN1cGxvYWQiLCJzcmMvc3VwZXJieXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKlxyXG4gKiBhc3luY3VwbG9hZC5qc1xyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGFtaWFucG9sYWsvYXN5bmN1cGxvYWQuanNcclxuICpcclxuICogQ29weXJpZ2h0IDIwMTcsIERhbWlhbiBQb2xha1xyXG4gKiBsaWIgdXNlZDogQm9vdHN0cmFwIDQuMC4wLCBzdXBlcmJ5dGVzLmpzXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcclxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICpcclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFqYXggPSAoKSA9PiB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG4gIHJldHVybiB7XHJcbiAgICBzZW5kOiAodXJsLCBkYXRhLCBhZGRpdGlvbmFsKSA9PiB7XHJcblxyXG4gICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgIHhoci5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKTtcclxuXHJcbiAgICAgIHhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBlID0+IHtcclxuICAgICAgICBhZGRpdGlvbmFsKGUpO1xyXG4gICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1RSQU5TRkVSIEZBSUxFRCEnKTtcclxuICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdUUkFOU0ZFUiBDQU5DRUxFRCEnKTtcclxuICAgICAgfSwgZmFsc2UpO1xyXG5cclxuICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVuZFwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1RoZSB0cmFuc2ZlciBmaW5pc2hlZCAoYWx0aG91Z2ggd2UgZG9udCBrbm93IGlmIGl0IHN1Y2NlZWRlZCBvciBub3QpLicpO1xyXG4gICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpZih4aHIucmVhZHlTdGF0ZSA9PSBYTUxIdHRwUmVxdWVzdC5ET05FICYmIHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgLy8gQWN0aW9uIGZvciBzdWNjZXNzXHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB4aHIuc2VuZChkYXRhKTtcclxuICAgIH1cclxuICB9O1xyXG59O1xyXG4iLCIvKlxyXG4gKiBhc3luY3VwbG9hZC5qc1xyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGFtaWFucG9sYWsvYXN5bmN1cGxvYWQuanNcclxuICpcclxuICogQ29weXJpZ2h0IDIwMTcsIERhbWlhbiBQb2xha1xyXG4gKiBsaWIgdXNlZDogQm9vdHN0cmFwIDQuMC4wLCBzdXBlcmJ5dGVzLmpzXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcclxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICpcclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHBhdHRlcm4gPSAoKSA9PiB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG4gIGNvbnN0IGlucHV0ID0ge1xyXG4gICAgbmFtZTogJ3VzZXJmaWxlW10nLFxyXG4gICAgdHlwZTogJ2ZpbGUnLFxyXG4gICAgaWQ6ICdfYXNJbnAtRmlsZUl0ZW0tJ1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGxpc3QgPSB7XHJcbiAgICBpZDogJ19hc0xpLUZpbGVJdGVtLScsXHJcbiAgICBjbGFzczogJ3Rlc3QgbGlzdC1ncm91cC1pdGVtIGFsaWduLW1pZGRsZSdcclxuICB9O1xyXG5cclxuICBjb25zdCBwcm9ncmVzcyA9IHtcclxuICAgIHdyYXBwZXJJZDogJ19hc0xpLVByb2dyZXNzQmFyJyxcclxuICAgIGJhcklkOiAnX2FzRGl2LVByb2dyZXNzQmFyJyxcclxuICAgIGluZm9JZDogJ19hc1AtUHJvZ3Jlc3NJbmZvJ1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbnB1dDogaW5wdXQsXHJcbiAgICBsaXN0OiBsaXN0LFxyXG4gICAgcHJvZ3Jlc3M6IHByb2dyZXNzXHJcbiAgfTtcclxuXHJcbn07XHJcbiIsIi8qXHJcbiAqIGFzeW5jdXBsb2FkLmpzXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYW1pYW5wb2xhay9hc3luY3VwbG9hZC5qc1xyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNywgRGFtaWFuIFBvbGFrXHJcbiAqIGxpYiB1c2VkOiBCb290c3RyYXAgNC4wLjAsIHN1cGVyYnl0ZXMuanNcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlOlxyXG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxyXG4gKlxyXG4gKi9cclxuY29uc3QgYSA9IHJlcXVpcmUoJy4vYXN1cGxvYWQtYWpheC5qcycpO1xyXG5jb25zdCBhamF4ID0gYSgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwcm9jID0gKCkgPT4ge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuICBsZXQgdXBsb2FkID0gKCgpID0+IHtcclxuICAgIGxldCBkYXRhRm9yVGhlU2VydmVyID0gbmV3IEZvcm1EYXRhKCk7XHJcblxyXG4gICAgbGV0IHByZXBhcmUgPSAoZGF0YUlucHV0cykgPT4ge1xyXG4gICAgICBsZXQgaW5wQ291bnQgPSBkYXRhSW5wdXRzLmxlbmd0aDtcclxuICAgICAgZm9yKGxldCBpID0gMTsgaSA8PSBpbnBDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG4gPSBkYXRhSW5wdXRzW2ktMV0uZmlsZXMubGVuZ3RoO1xyXG4gICAgICAgIGZvcihsZXQgaiA9IDA7IGogPD0gbiAtIDE7IGorKykge1xyXG4gICAgICAgICAgbGV0IGZpbGUgPSBkYXRhSW5wdXRzW2ktMV0uZmlsZXNbal07XHJcbiAgICAgICAgICBsZXQgZCA9IGRhdGFGb3JUaGVTZXJ2ZXIuZ2V0QWxsKCd1c2VyZmlsZVtdJyk7XHJcbiAgICAgICAgICBpZighZC5maW5kKHggPT4geC5uYW1lID09PSBmaWxlLm5hbWUpKSB7XHJcbiAgICAgICAgICAgIGlmKGZpbGVzLmxpc3QoKS5maW5kKHggPT4geC5uYW1lID09PSBmaWxlLm5hbWUpKVxyXG4gICAgICAgICAgICAgIGRhdGFGb3JUaGVTZXJ2ZXIuYXBwZW5kKCd1c2VyZmlsZVtdJywgZmlsZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGRhdGFGb3JUaGVTZXJ2ZXIuYXBwZW5kKCdhcHByb3ZlZEZpbGVzJywgSlNPTi5zdHJpbmdpZnkoZmlsZXMubGlzdCgpKSk7XHJcbiAgICAgIHJldHVybiBkYXRhRm9yVGhlU2VydmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzZW5kID0gKGFqYXhVcmwsIGFqYXhEYXRhLCBwcm9ncmVzcykgPT4ge1xyXG4gICAgICBhamF4LnNlbmQoYWpheFVybCwgYWpheERhdGEsIHByb2dyZXNzKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZmlsZXMgPSAoKCkgPT4ge1xyXG4gICAgICBsZXQgYXBwcm92ZWQgPSBbXTtcclxuICAgICAgbGV0IGNvdXJzZSA9IDA7XHJcbiAgICAgIGxldCBjb3VudCA9IDA7XHJcblxyXG4gICAgICBsZXQgYWRkID0gKGl0ZW0pID0+IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gYXBwcm92ZWQuZmluZCh4ID0+IHgubmFtZSA9PT0gaXRlbS5uYW1lKTtcclxuICAgICAgICBpZihyZXN1bHQgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBhcHByb3ZlZC5wdXNoKCB7XHJcbiAgICAgICAgICAgICduYW1lJzppdGVtLm5hbWUsXHJcbiAgICAgICAgICAgICd0eXBlJzppdGVtLnR5cGUsXHJcbiAgICAgICAgICAgICdzaXplJzppdGVtLnNpemVcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdQbGlrIGp1xbwgaXN0bmllamUhJyk7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgcmVtb3ZlID0gKGl0ZW0pID0+IHtcclxuICAgICAgICBsZXQgaW5kZXggPSBhcHByb3ZlZC5maW5kSW5kZXgoeCA9PiB4Lm5hbWUgPT0gaXRlbSk7XHJcbiAgICAgICAgaWYoIShpbmRleCA8IDApKSB7XHJcbiAgICAgICAgICBhcHByb3ZlZC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgY291bnQtLTtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGFkZDogYWRkLFxyXG4gICAgICAgIHJlbW92ZTogcmVtb3ZlLFxyXG4gICAgICAgIGxpc3Q6ICgpID0+IHtcclxuICAgICAgICAgIHJldHVybiBhcHByb3ZlZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluYzogKCkgPT4ge1xyXG4gICAgICAgICAgY291cnNlKys7XHJcbiAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0Q291bnQ6ICgpID0+IHtcclxuICAgICAgICAgIHJldHVybiBjb3VudDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldENvdXJzZTogKCkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGNvdXJzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNlbmQ6IHNlbmQsXHJcbiAgICAgIGZpbGVzOiBmaWxlcyxcclxuICAgICAgZ2V0RGF0YTogKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBkYXRhRm9yVGhlU2VydmVyO1xyXG4gICAgICB9LFxyXG4gICAgICBwcmVwYXJlOiBwcmVwYXJlXHJcbiAgICB9XHJcbiAgfSkoKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHVwbG9hZDogdXBsb2FkXHJcbiAgfVxyXG59O1xyXG4iLCIvKlxyXG4gKiBhc3luY3VwbG9hZC5qc1xyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGFtaWFucG9sYWsvYXN5bmN1cGxvYWQuanNcclxuICpcclxuICogQ29weXJpZ2h0IDIwMTcsIERhbWlhbiBQb2xha1xyXG4gKiBsaWIgdXNlZDogQm9vdHN0cmFwIDQuMC4wLCBzdXBlcmJ5dGVzLmpzXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcclxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICpcclxuICovXHJcblxyXG5jb25zdCBhc19wYXR0ID0gcmVxdWlyZSgnLi9hc3VwbG9hZC1wYXR0ZXJuLmpzJyk7XHJcbmNvbnN0IHN1cGVyYnl0ZXMgPSByZXF1aXJlKCcuL3N1cGVyYnl0ZXMuanMnKTtcclxuY29uc3QgcGF0dGVybiA9IGFzX3BhdHQoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdWkgPSAoKSA9PiB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG4gIGxldCBpbnB1dCA9ICgoKSA9PiB7XHJcblxyXG4gICAgbGV0IGNvdW50ID0gMDtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhZGQ6IChwbGFjZSkgPT4ge1xyXG4gICAgICAgIC8vIGluY3JlbWVudCBxdWFudGl0eSBvZiBpbnB1dHNcclxuICAgICAgICBpbnB1dC5pbmMoKTtcclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBwYXR0ZXJuLmlucHV0Lm5hbWUpO1xyXG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCBwYXR0ZXJuLmlucHV0LnR5cGUpO1xyXG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7cGF0dGVybi5pbnB1dC5pZH0ke2lucHV0LnZhbHVlKCl9YCk7XHJcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgJ2hpZGRlbicpO1xyXG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ211bHRpcGxlJywgJ211bHRpcGxlJyk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGxhY2UpLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgICB9LFxyXG4gICAgICBpbmM6ICgpID0+IHtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9LFxyXG4gICAgICB2YWx1ZTogKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBjb3VudDtcclxuICAgICAgfSxcclxuICAgICAgZ2V0QWxsOiAoKSA9PiB7XHJcbiAgICAgICAgbGV0IG9iakFycmF5ID0gW107XHJcbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8PSBpbnB1dC52YWx1ZSgpOyBpKyspIHtcclxuICAgICAgICAgIGxldCBuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7cGF0dGVybi5pbnB1dC5pZH0ke2l9YCkuZmlsZXMubGVuZ3RoO1xyXG4gICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8PSBuIC0gMTsgaisrKSB7XHJcbiAgICAgICAgICAgIG9iakFycmF5LnB1c2goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7cGF0dGVybi5pbnB1dC5pZH0ke2l9YCkuZmlsZXNbal0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JqQXJyYXk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHBhdHRlcm46IHBhdHRlcm5cclxuXHJcbiAgICB9O1xyXG4gIH0pKCk7XHJcblxyXG4gIGxldCBsaXN0ID0gKCgpID0+IHtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhZGQ6IChpdGVtLCBpbmRleCwgcGxhY2UpID0+IHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBwYXR0ZXJuLmxpc3QuY2xhc3MpO1xyXG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7cGF0dGVybi5saXN0LmlkfSR7aW5kZXh9YCk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGxhY2UpLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICBsZXQgZWxlbWVudERpdkZpbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgIGVsZW1lbnREaXZGaWxlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnaXRlbVRleHRUcnVuYycpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3BhdHRlcm4ubGlzdC5pZH0ke2luZGV4fWApLmFwcGVuZENoaWxkKGVsZW1lbnREaXZGaWxlKTtcclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnRTcGFuRmlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgIGVsZW1lbnRTcGFuRmlsZS5zZXRBdHRyaWJ1dGUoJ2lkJywgYF9hcy1GaWxlSXRlbS1OYW1lLSR7aW5kZXh9YCk7XHJcbiAgICAgICAgZWxlbWVudERpdkZpbGUuYXBwZW5kQ2hpbGQoZWxlbWVudFNwYW5GaWxlKTtcclxuICAgICAgICBlbGVtZW50U3BhbkZpbGUuaW5uZXJIVE1MID0gaXRlbS5uYW1lO1xyXG5cclxuICAgICAgICBsZXQgZWxlbWVudERpdkZpbGVJbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICBlbGVtZW50RGl2RmlsZUluZm8uc2V0QXR0cmlidXRlKCdjbGFzcycsICdfYXNEaXYtSXRlbUluZm8nKTtcclxuICAgICAgICBlbGVtZW50RGl2RmlsZS5hcHBlbmRDaGlsZChlbGVtZW50RGl2RmlsZUluZm8pO1xyXG4gICAgICAgIGVsZW1lbnREaXZGaWxlSW5mby5pbm5lckhUTUwgPSBgU2l6ZTogJHtzdXBlcmJ5dGVzKGl0ZW0uc2l6ZSl9IHwgVHlwZTogJHtpdGVtLnR5cGV9YDtcclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnREaXZSZW1vdmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgIGVsZW1lbnREaXZSZW1vdmVCdXR0b24uc2V0QXR0cmlidXRlKCdjbGFzcycsICdpdGVtUmVtb3ZlQnV0dG9uJyk7XHJcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChlbGVtZW50RGl2UmVtb3ZlQnV0dG9uKTtcclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnRJQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG4gICAgICAgICAgZWxlbWVudElCdG4uc2V0QXR0cmlidXRlKCdjbGFzcycsICdidG4tYWN0IGZhIGZhLXRpbWVzIHRleHQtcHJpbWFyeScpO1xyXG4gICAgICAgICAgZWxlbWVudElCdG4uc2V0QXR0cmlidXRlKCdpZCcsIGBfYXNJLUZpbGVJdGVtLVJlbS0ke2luZGV4fWApO1xyXG4gICAgICAgIGVsZW1lbnREaXZSZW1vdmVCdXR0b24uYXBwZW5kQ2hpbGQoZWxlbWVudElCdG4pO1xyXG5cclxuICAgICAgfSxcclxuICAgICAgcmVtb3ZlOiAoaWQpID0+IHtcclxuICAgICAgICBsZXQgcmVzID0gaWQuc3BsaXQoJy0nKTtcclxuICAgICAgICBsZXQgaW5kZXggPSByZXNbcmVzLmxlbmd0aC0xXTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHtwYXR0ZXJuLmxpc3QuaWR9JHtpbmRleH1gKS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IG5vbmU7Jyk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSkoKTtcclxuXHJcbiAgbGV0IHByb2dyZXNzID0gKCgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNob3c6ICgpID0+IHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXR0ZXJuLnByb2dyZXNzLndyYXBwZXJJZCkuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBibG9jazsnKTtcclxuICAgICAgfSxcclxuICAgICAgaW5jOiAodmFsdWUsIGxvYWRlZCwgdG90YWwpID0+IHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXR0ZXJuLnByb2dyZXNzLmJhcklkKS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYHdpZHRoOiAke3ZhbHVlfSVgKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXR0ZXJuLnByb2dyZXNzLmJhcklkKS5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCBgJHt2YWx1ZX1gKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXR0ZXJuLnByb2dyZXNzLmluZm9JZCkuaW5uZXJIVE1MID0gYCR7dmFsdWV9JSB8ICR7c3VwZXJieXRlcyhsb2FkZWQpfS8ke3N1cGVyYnl0ZXModG90YWwpfWA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KSgpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5wdXQ6IGlucHV0LFxyXG4gICAgbGlzdDogbGlzdCxcclxuICAgIHByb2dyZXNzOiBwcm9ncmVzc1xyXG4gIH07XHJcbn07XHJcbiIsIi8qXHJcbiAqIGFzeW5jdXBsb2FkLmpzXHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kYW1pYW5wb2xhay9hc3luY3VwbG9hZC5qc1xyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxNywgRGFtaWFuIFBvbGFrXHJcbiAqIGxpYiB1c2VkOiBCb290c3RyYXAgNC4wLjAsIHN1cGVyYnl0ZXMuanNcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlOlxyXG4gKiBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxyXG4gKlxyXG4gKi9cclxuXHJcbmNvbnN0IGFzX3Byb2MgPSByZXF1aXJlKCcuL2FzdXBsb2FkLXByb2MuanMnKTtcclxuY29uc3QgYXNfcGF0dCA9IHJlcXVpcmUoJy4vYXN1cGxvYWQtcGF0dGVybi5qcycpO1xyXG5jb25zdCBhc191aSA9IHJlcXVpcmUoJy4vYXN1cGxvYWQtdWkuanMnKTtcclxuXHJcbmNvbnN0IHByb2MgPSBhc19wcm9jKCk7XHJcbmNvbnN0IHBhdHRlcm4gPSBhc19wYXR0KCk7XHJcbmNvbnN0IHVpID0gYXNfdWkoKTtcclxuXHJcbigoKSA9PiB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAvLyBCdXR0b25zIGlkXHJcbiAgY29uc3QgaWRCdG5BZGRGaWxlcyA9ICdfYXNCdG4tQWRkRmlsZXMnO1xyXG4gIGNvbnN0IGlkQnRuU2VuZEZpbGVzID0gJ19hc0J0bi1TZW5kRmlsZXMnO1xyXG4gICAgY29uc3QgaWRCdG5TZW5kRmlsZXNXcmFwcGVyID0gJ19hc0xpLVNlbmRGaWxlcyc7XHJcbiAgY29uc3QgaWRCdG5SZW1GaWxlID0gJ19hc0ktRmlsZUl0ZW0tUmVtLSc7XHJcblxyXG4gIC8vIFBsYWNlcyBpZFxyXG4gIGNvbnN0IGlkRnJtSW5wdXRzID0gJ19hc0ZybS1JbnB1dEZpbGVzJztcclxuICBjb25zdCBpZFVsTGlzdEZpbGVzID0gJ19hc1VsLUxpc3RGaWxlcyc7XHJcbiAgY29uc3QgaWRTcGFuRmlsZU5hbWUgPSAnX2FzLUZpbGVJdGVtLU5hbWUtJztcclxuXHJcbiAgbGV0IGVsQnRuQWRkRmlsZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZEJ0bkFkZEZpbGVzKTtcclxuICBsZXQgZWxCdG5TZW5kRmlsZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZEJ0blNlbmRGaWxlcyk7XHJcblxyXG4gIC8vIE1haW4gY29udGFpbmVyIC0gZG9jdW1lbnQgcmVhZHlcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG5cclxuICAgIC8vIENsaWNrIGV2ZW50IGFkZCBmaWxlcywgdHJpZ2dlcnMgaW5wdXQgY2xpY2tcclxuICAgIGVsQnRuQWRkRmlsZXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICBhZGRDbGljayhlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENsaWNrIGV2ZW50IHNlbmQgZmlsZXNcclxuICAgIGVsQnRuU2VuZEZpbGVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB1aS5wcm9ncmVzcy5zaG93KCk7XHJcbiAgICAgIC8vIEhpZGUgU2VuZCBCdXR0b25cclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRCdG5TZW5kRmlsZXNXcmFwcGVyKS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IG5vbmUnKTtcclxuICAgICAgc2VuZENsaWNrKGUpO1xyXG4gICAgfSk7XHJcblxyXG4gIH0pO1xyXG5cclxuICBsZXQgdG9nZ2xlRHJhZ0FyZWEgPSAoZSkgPT4ge1xyXG4gICAgaWYocHJvYy51cGxvYWQuZmlsZXMuZ2V0Q291bnQoKSA9PSAwKSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmFnLWFyZWEnKS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IGZsZXgnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmFnLWFyZWEnKS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IG5vbmUnKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gRnVuY3Rpb24gYm9keSBmb3IgZXZlbnQgYWRkaW5nIGZpbGVzIGNsaWNrXHJcbiAgbGV0IGFkZENsaWNrID0gKGUpID0+IHtcclxuICAgIHVpLmlucHV0LmFkZChpZEZybUlucHV0cyk7XHJcblxyXG4gICAgY29uc3QgY3VycklucHV0ID0gYCR7cGF0dGVybi5pbnB1dC5pZH0ke3VpLmlucHV0LnZhbHVlKCl9YDtcclxuICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY3VycklucHV0KTtcclxuICAgIGVsZW1lbnQuY2xpY2soKTtcclxuXHJcbiAgICAvLyBFVkVOVCBDSEFOR0UgSU5QVVQgRklMRVNcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcclxuICAgICAgaW5wdXRDaGFuZ2UoZSk7XHJcbiAgICAgIHRvZ2dsZURyYWdBcmVhKGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBsZXQgaW5wdXRDaGFuZ2UgPSAoZSkgPT4ge1xyXG4gICAgbGV0IGZpbGVzID0gZS50YXJnZXQuZmlsZXM7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDw9IGZpbGVzLmxlbmd0aC0xOyBpKyspXHJcbiAgICAgIGlmKHByb2MudXBsb2FkLmZpbGVzLmFkZCAoZmlsZXNbaV0pKSB7XHJcbiAgICAgICAgcHJvYy51cGxvYWQuZmlsZXMuaW5jKCk7XHJcblxyXG4gICAgICAgIGxldCBmaWxlQ291cnNlID0gcHJvYy51cGxvYWQuZmlsZXMuZ2V0Q291cnNlKCk7XHJcbiAgICAgICAgdWkubGlzdC5hZGQoZmlsZXNbaV0sIGZpbGVDb3Vyc2UsIGlkVWxMaXN0RmlsZXMpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHtpZEJ0blJlbUZpbGV9JHtmaWxlQ291cnNlfWApLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHJcbiAgICAgICAgICByZW1vdmVDbGljayhlKTtcclxuICAgICAgICAgIHRvZ2dsZURyYWdBcmVhKGUpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGxldCByZW1vdmVDbGljayA9IChlKSA9PiB7XHJcbiAgICBsZXQgcmVzID0gZS50YXJnZXQuaWQuc3BsaXQoJy0nKTtcclxuICAgIGxldCBpbmRleCA9IHJlc1tyZXMubGVuZ3RoLTFdO1xyXG5cclxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7aWRTcGFuRmlsZU5hbWV9JHtpbmRleH1gKTtcclxuICAgIGlmKHByb2MudXBsb2FkLmZpbGVzLnJlbW92ZShlbGVtLmlubmVyVGV4dCkpIHtcclxuICAgICAgdWkubGlzdC5yZW1vdmUgKGUudGFyZ2V0LmlkKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxldCBzZW5kQ2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgbGV0IGFyID0gdWkuaW5wdXQuZ2V0QWxsKCk7XHJcbiAgICBsZXQgYyA9IHVpLmlucHV0LnZhbHVlKCk7XHJcbiAgICBsZXQgb2JqSW5wdXRzID0gW107XHJcblxyXG4gICAgZm9yKGxldCBpID0gMTsgaSA8PSBjOyBpKyspXHJcbiAgICAgIG9iaklucHV0cy5wdXNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3BhdHRlcm4uaW5wdXQuaWR9JHtpfWApKTtcclxuXHJcbiAgICAgIHByb2MudXBsb2FkLnNlbmQoJ3NlcnZlci91cGxvYWQucGhwJywgcHJvYy51cGxvYWQucHJlcGFyZShvYmpJbnB1dHMpLCBlID0+IHtcclxuICAgICAgICBpZiAoZS5sZW5ndGhDb21wdXRhYmxlKSB7XHJcbiAgICAgICAgICBsZXQgcGVyY2VudENvbXBsZXRlID0gZS5sb2FkZWQgLyBlLnRvdGFsO1xyXG4gICAgICAgICAgcGVyY2VudENvbXBsZXRlID0gcGFyc2VJbnQocGVyY2VudENvbXBsZXRlICogMTAwKTtcclxuICAgICAgICAgIHVpLnByb2dyZXNzLmluYyhwZXJjZW50Q29tcGxldGUsIGUubG9hZGVkLCBlLnRvdGFsKTtcclxuICAgICAgICAgIGlmIChwZXJjZW50Q29tcGxldGUgPT09IDEwMCkge1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxufSkoKTtcclxuIiwiLypcclxuICogc3VwZXJieXRlcy5qc1xyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZGFtaWFucG9sYWsvc3VwZXJieXRlcy5qc1xyXG4gKlxyXG4gKiBDb3B5cmlnaHQgMjAxOCwgRGFtaWFuIFBvbGFrXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcclxuICogaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICpcclxuICovXHJcblxyXG4vLyBVc2FnZTogc3VwZXJieXRlcyhieXRlcywgYXJnMSwgYXJnMilcclxuLy8gYnl0ZXMgOiBudW1iZXIgdmFsdWUgaW4gYnl0ZXNcclxuLy8gYXJnMSA6IFNJIG1ldHJpYyBzeXN0ZW0gb3IgdHJhZGl0aW9uYWwgKHRydWUgb3IgZmFsc2UsIGRlZmF1bHQgaXMgZmFsc2UgdHJhZGl0aW9uYWwgMTAyNF5uKVxyXG4vLyBhcmcyIDogZGVjaW1hbCBudW1iZXIgYWZ0ZXIgcG9pbnQgKGRlZmF1bHQgaXMgMilcclxuLy8gWW91IGNhbiB1c2UgYXJnMSBhbmQgYXJnMiBpbnRlcmNoYW5nZWFibHlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3VwZXJieXRlcyA9IChieXRlcywgYXJnMSwgYXJnMikgPT4ge1xyXG4gICAndXNlIHN0cmljdCc7XHJcblxyXG4gICBjb25zdCBVTklUUyA9IFsnQicsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddO1xyXG4gICBieXRlcyA9IE1hdGguYWJzKGJ5dGVzKTtcclxuICAgbGV0IGRpdmlkZXIsXHJcbiAgICAgICBzaSxcclxuICAgICAgIGRpZ2l0cyA9IDA7XHJcblxyXG4gICBpZigoYXJnMSA9PT0gdW5kZWZpbmVkKSAmJiAoYXJnMiA9PT0gdW5kZWZpbmVkKSkge1xyXG4gICAgIGRpdmlkZXIgPSAxMDI0O1xyXG4gICAgIGRpZ2l0cyA9IDI7XHJcbiAgIH1cclxuICAgaWYodHlwZW9mIGFyZzEgPT09ICdib29sZWFuJykge1xyXG4gICAgIGlmKGFyZzEpIHtcclxuICAgICAgIGRpdmlkZXIgPSAxMDAwO1xyXG4gICAgIH0gZWxzZSB7XHJcbiAgICAgICBkaXZpZGVyID0gMTAyNDtcclxuICAgICB9XHJcbiAgICAgaWYodHlwZW9mIGFyZzIgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICBkaWdpdHMgPSBhcmcyO1xyXG4gICAgIH0gZWxzZSB7XHJcbiAgICAgICBkaWdpdHMgPSAyO1xyXG4gICAgIH1cclxuICAgfSBlbHNlIGlmKHR5cGVvZiBhcmcxID09PSAnbnVtYmVyJykge1xyXG4gICAgIGRpZ2l0cyA9IGFyZzE7XHJcbiAgICAgaWYodHlwZW9mIGFyZzIgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgaWYoYXJnMikge1xyXG4gICAgICAgICBkaXZpZGVyID0gMTAwMDtcclxuICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgIGRpdmlkZXIgPSAxMDI0O1xyXG4gICAgICAgfVxyXG4gICAgIH0gZWxzZSB7XHJcbiAgICAgICBkaXZpZGVyID0gMTAyNDtcclxuICAgICB9XHJcbiAgIH1cclxuXHJcbiAgIGlmKE51bWJlci5pc0Zpbml0ZShieXRlcykpIHtcclxuICAgICBpZihieXRlcyA8IGRpdmlkZXIpIHtcclxuICAgICAgIGxldCBudW0gPSBieXRlcztcclxuICAgICAgIHJldHVybiBgJHtudW19ICR7VU5JVFNbMF19YDtcclxuICAgICB9XHJcblxyXG4gICAgIGZvcihsZXQgaSA9IDE7IGkgPD0gODsgaSsrKSB7XHJcbiAgICAgICBpZihieXRlcyA+PSBNYXRoLnBvdyhkaXZpZGVyLCBpKSAmJiBieXRlcyA8IE1hdGgucG93KGRpdmlkZXIsIGkrMSkpIHtcclxuICAgICAgICAgbGV0IG51bSA9IChieXRlcy9NYXRoLnBvdyhkaXZpZGVyLCBpKSkudG9GaXhlZChkaWdpdHMpO1xyXG4gICAgICAgICByZXR1cm4gYCR7bnVtfSAke1VOSVRTW2ldfWA7XHJcbiAgICAgICB9XHJcbiAgICAgfVxyXG4gICB9XHJcbiB9O1xyXG4iXX0=

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
      progress.show();
      // Hide Send Button
      document.getElementById(idBtnSendFilesWrapper).setAttribute('style', 'display: none');
      sendClick(e);
    });

  });

  // Function body for event adding files click
  let addClick = (e) => {
    input.add(idFrmInputs);

    const currInput = `${input.pattern.id}${input.value()}`;
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
        list.add(files[i], fileCount, idUlListFiles);

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
      list.remove (e.target.id);
      console.log(proc.upload.files.list());
    }
  }

  let sendClick = (e) => {
    let ar = input.getAll();
    console.log(`SEND FILES: ${ar.length}`);
    let c = input.value();
    console.log(`SEND INPUTS: ${c}`);
    let objInputs = [];

    for(let i = 1; i <= c; i++)
      objInputs.push(document.getElementById(`${inputPattern.id}${i}`));

    proc.upload.send('server/upload.php', proc.upload.prepare(objInputs), e => {

      var percentComplete = e.loaded / e.total;

      percentComplete = parseInt(percentComplete * 100);

        progress.inc(percentComplete, e.loaded, e.total);
        console.log(`TARGET: ${e.target}`);
      if (percentComplete === 100) {

      }
    });

  }
})();

const inputPattern = {
  name: 'userfile[]',
  type: 'file',
  id: '_asInp-FileItem-'
};

const listPattern = {
  id: '_asLi-FileItem-',
  class: 'test list-group-item align-middle'
};

const progressPattern = {
  wrapperId: '_asLi-ProgressBar',
  barId: '_asDiv-ProgressBar',
  infoId: '_asP-ProgressInfo'
}

let input = (() => {
  const pattern = inputPattern;
  let count = 0;

  return {
    add: (place) => {
      // increment quantity of inputs
      input.inc();
      console.log('add');

      let element = document.createElement('input');
        element.setAttribute('name', pattern.name);
        element.setAttribute('type', pattern.type);
        element.setAttribute('id', `${pattern.id}${input.value()}`);
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
        let n = document.getElementById(`${pattern.id}${i}`).files.length;
        for(let j = 0; j <= n - 1; j++) {
          objArray.push(document.getElementById(`${pattern.id}${i}`).files[j]);
        }
      }
      return objArray;
    },
    pattern: pattern

  };
})();

let list = (() => {
  const pattern = listPattern;
  return {
    add: (item, index, place) => {
      let element = document.createElement('li');
        element.setAttribute('class', pattern.class);
        element.setAttribute('id', `${pattern.id}${index}`);
      document.getElementById(place).appendChild(element);

      let elementDivFile = document.createElement('div');
        elementDivFile.setAttribute('class', 'itemTextTrunc');
      document.getElementById(`${pattern.id}${index}`).appendChild(elementDivFile);

      let elementSpanFile = document.createElement('span');
        elementSpanFile.setAttribute('id', `_as-FileItem-Name-${index}`);
      elementDivFile.appendChild(elementSpanFile);
      elementSpanFile.innerHTML = item.name;

      let elementDivFileInfo = document.createElement('div');
        elementDivFileInfo.setAttribute('class', '_asDiv-ItemInfo');
      elementDivFile.appendChild(elementDivFileInfo);
      elementDivFileInfo.innerHTML = `Size: ${item.size} | Type: ${item.type}`;

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
      document.getElementById(`${listPattern.id}${index}`).setAttribute('style', 'display: none;');
      console.log(`HIDE ELEMENT: `);
    }
  };
})();

let progress = (() => {
  return {
    show: () => {
      document.getElementById(progressPattern.wrapperId).setAttribute('style', 'display: block;');
    },
    inc: (value, loaded, total) => {
      document.getElementById(progressPattern.barId).setAttribute('style', `width: ${value}%`);
      document.getElementById(progressPattern.barId).setAttribute('aria-valuenow', `${value}`);
      //document.getElementById(progressPattern.infoId).setAttribute(`${value}% | ${loaded}/${total}`);
      document.getElementById(progressPattern.infoId).innerHTML = `${value}% | ${loaded}/${total}`;
    }
  }
})();

const proc = (() => {
  'use strict';

  let upload = (() => {
    let dataForTheServer = new FormData();

    let prepare = (dataInputs) => {
      console.log(dataInputs);
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

      // CHANGE TO RAW JAVASCRIPT

      $.ajax({
          type: 'POST',
          url: ajaxUrl,
          cache: false,
          contentType: false,
          processData: false,
          data : ajaxData,

          xhr: () => {
            let xhr = new window.XMLHttpRequest();

            xhr.upload.addEventListener('progress', e => {
              if (e.lengthComputable) {
                progress(e);
              }
            }, false);

            return xhr;
          },
          success: result => {
              console.log('success');
              $('#response').html(result);
          },
          error: err => {
              console.log(err);
          }
      })



    }

    let files = (() => {
      let approved = [];
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
          count++;
        },
        getCount: () => {
          return count;
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
})();

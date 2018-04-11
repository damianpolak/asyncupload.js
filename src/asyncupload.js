(() => {
  'use strict';

  // Buttons id
  const idBtnAddFiles = '_asBtn-AddFiles';
  const idBtnSendFiles = '_asBtn-SendFiles';
  const idBtnRemFile = '_asI-FileItem-Rem-';

  // Places id
  const idFrmInputs = '_asFrm-InputFiles';
  const idUlListFiles = '_asUl-ListFiles';

  let elBtnAddFiles = document.getElementById(idBtnAddFiles);
  let elBtnSendFiles = document.getElementById(idBtnSendFiles);



  document.addEventListener('DOMContentLoaded', () => {
    // Click event for add files button, trigger click on hidden input
    elBtnAddFiles.addEventListener('click', () => {
      console.log('CLICKED ADD FILES');
      input.add(idFrmInputs);


      const currInput = `${input.pattern.id}${input.value()}`;
      let element = document.getElementById(currInput);
      element.click();

      element.addEventListener('change', (e) => {
        console.log(`change: ${e}`);


        let files = e.target.files;
        for(let i = 0; i <= files.length-1; i++)
          if(proc.upload.files.add (files[i])) {
            proc.upload.files.inc();

            let fileCount = proc.upload.files.getCount();
            list.add(files[i], fileCount, idUlListFiles);

            document.getElementById(`${idBtnRemFile}${fileCount}`).addEventListener('click', (e) => {
              console.log(`Clicked: ${e.target.id}`);

              // Dopisać do remove click
            })
          }

      });

    });

    // Click event for send files button
    elBtnSendFiles.addEventListener('click', () => {
      console.log('CLICKED SEND FILES');

    });

  });
})();

const inputPattern = {
  name: 'userfile[]',
  type: 'file',
  id: '_asInp-FileItem-'
};

let listPattern = {
  id: '_asLi-FileItem-',
  class: 'test list-group-item align-middle'
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

    }
  };
})();

const proc = (() => {
  'use strict';

  let upload = (() => {
    let dataForTheServer = new FormData();

    let prepare = (dataInputs) => {
      console.log(dataInputs);
      let inpCount = dataInputs.length;
      for(let i = 1; i <= inpCount; i++) {
        let n = dataInputs[i-1].get(0).files.length;
        for(let j = 0; j <= n - 1; j++) {
          let file = dataInputs[i-1].get(0).files[j];
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
      // AJAX CALL
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
        //console.log(`proc-item-remove: ${item}`)
        let index = approved.findIndex(x => x.name == item);
        // index is positon, index < 0 = not exists
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

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

module.exports = proc = () => {
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
};

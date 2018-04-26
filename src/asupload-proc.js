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

module.exports = proc = () => {
  'use strict';
  let upload = (() => {
    let dataForTheServer = new FormData();

    let prepareInputs = (dataObjects) => {
      let objectsCount = dataObjects.length;

      for(let i = 1; i <= objectsCount; i++) {
        let n = dataObjects[i-1].files.length;
        for(let j = 0; j <= n - 1; j++) {
          let file = dataObjects[i-1].files[j];
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

    let prepareDrop = (dropData) => {
      dropData.append('approvedFiles', JSON.stringify(files.list()));
      return dropData
    }

    let send = (ajaxUrl, ajaxData, progress) => {
      const ajax = a();
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
      prepareInputs: prepareInputs,
      prepareDrop: prepareDrop
    }
  })();

  return {
    upload: upload
  }
};

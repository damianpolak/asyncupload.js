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
        console.log('add');

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
        //document.getElementById(progressPattern.infoId).setAttribute(`${value}% | ${loaded}/${total}`);
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

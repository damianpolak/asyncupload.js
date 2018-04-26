(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
        }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];return o(n || r);
        }, p, p.exports, r, e, n, t);
      }return n[i].exports;
    }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
      o(t[i]);
    }return o;
  }return r;
})()({ 1: [function (require, module, exports) {

    module.exports = ajax = function ajax() {
      'use strict';

      return {
        send: function send(url, data, eventListeners) {

          var xhr = new XMLHttpRequest();
          xhr.open('POST', url, true);

          eventListeners(xhr);

          xhr.upload.addEventListener("error", function () {}, false);

          xhr.upload.addEventListener("abort", function () {}, false);

          xhr.upload.addEventListener("loadend", function () {}, false);

          xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {}
          };
          xhr.send(data);
        }
      };
    };
  }, {}], 2: [function (require, module, exports) {

    module.exports = pattern = function pattern() {
      'use strict';

      var input = {
        name: 'userfile[]',
        type: 'file',
        id: '_asInp-FileItem-'
      };

      var list = {
        id: '_asLi-FileItem-',
        class: 'test list-group-item align-middle'
      };

      var progress = {
        wrapperId: '_asLi-ProgressBar',
        barId: '_asDiv-ProgressBar',
        infoId: '_asP-ProgressInfo'
      };

      var dropzone = {
        id: 'scrollZone'
      };

      return {
        input: input,
        list: list,
        dropzone: dropzone,
        progress: progress
      };
    };
  }, {}], 3: [function (require, module, exports) {
    var a = require('./asupload-ajax.js');

    module.exports = proc = function proc() {
      'use strict';

      var upload = function () {
        var dataForTheServer = new FormData();

        var prepare = function prepare(inputObjects, dropObjects) {
          var countInputs = inputObjects.length;
          for (var i = 1; i <= countInputs; i++) {
            var n = inputObjects[i - 1].files.length;

            var _loop = function _loop(j) {
              var file = inputObjects[i - 1].files[j];
              var d = dataForTheServer.getAll('userfile[]');
              if (!d.find(function (x) {
                return x.name === file.name;
              })) {
                if (files.list().find(function (x) {
                  return x.name === file.name;
                })) dataForTheServer.append('userfile[]', file);
              }
            };

            for (var j = 0; j <= n - 1; j++) {
              _loop(j);
            }
          }

          var countDrops = dropObjects.length - 1;

          var _loop2 = function _loop2(_i) {
            var file = dropObjects[_i];

            var d = dataForTheServer.getAll('userfile[]');
            if (!d.find(function (x) {
              return x.name === file.name;
            })) {
              if (files.list().find(function (x) {
                return x.name === file.name;
              })) dataForTheServer.append('userfile[]', file);
            }
          };

          for (var _i = 0; _i <= countDrops; _i++) {
            _loop2(_i);
          }

          dataForTheServer.append('approvedFiles', JSON.stringify(files.list()));
          return dataForTheServer;
        };

        var send = function send(ajaxUrl, ajaxData, progress) {
          var ajax = a();
          ajax.send(ajaxUrl, ajaxData, progress);
        };

        var files = function () {
          var approved = [];
          var course = 0;
          var count = 0;

          var add = function add(item) {
            var result = approved.find(function (x) {
              return x.name === item.name;
            });
            if (result == undefined) {
              approved.push({
                'name': item.name,
                'type': item.type,
                'size': item.size
              });
              return true;
            } else {
              return false;
            }
          };

          var remove = function remove(item) {
            var index = approved.findIndex(function (x) {
              return x.name == item;
            });
            if (!(index < 0)) {
              approved.splice(index, 1);
              count--;
              return true;
            } else {
              return false;
            }
          };

          return {
            add: add,
            remove: remove,
            list: function list() {
              return approved;
            },
            inc: function inc() {
              course++;
              count++;
            },
            getCount: function getCount() {
              return count;
            },
            getCourse: function getCourse() {
              return course;
            }
          };
        }();

        return {
          send: send,
          files: files,
          getData: function getData() {
            return dataForTheServer;
          },
          prepare: prepare
        };
      }();

      return {
        upload: upload
      };
    };
  }, { "./asupload-ajax.js": 1 }], 4: [function (require, module, exports) {

    var as_patt = require('./asupload-pattern.js');
    var superbytes = require('./superbytes.js');
    var pattern = as_patt();

    module.exports = ui = function ui() {
      'use strict';

      var input = function () {
        var count = 0;
        return {
          add: function add(place) {
            input.inc();

            var element = document.createElement('input');
            element.setAttribute('name', pattern.input.name);
            element.setAttribute('type', pattern.input.type);
            element.setAttribute('id', "" + pattern.input.id + input.value());
            element.setAttribute('hidden', 'hidden');
            element.setAttribute('multiple', 'multiple');
            document.getElementById(place).appendChild(element);
          },
          inc: function inc() {
            count++;
          },
          value: function value() {
            return count;
          },
          getAll: function getAll() {
            var objArray = [];
            for (var i = 1; i <= input.value(); i++) {
              var n = document.getElementById("" + pattern.input.id + i).files.length;
              for (var j = 0; j <= n - 1; j++) {
                objArray.push(document.getElementById("" + pattern.input.id + i).files[j]);
              }
            }
            return objArray;
          },
          pattern: pattern

        };
      }();

      var drop = function () {
        var count = 0;
        var dropObjects = [];

        return {
          add: function add(item) {
            drop.inc();
            dropObjects.push(item);
          },
          getAll: function getAll() {
            return dropObjects;
          },
          inc: function inc() {
            count++;
          },
          value: function value() {
            return count;
          }
        };
      }();

      var test = function () {
        var count = 0;
        var dropObjects = [];

        return {
          add: function add(item) {
            test.inc();
            dropObjects.push(item);
          },
          getAll: function getAll() {
            return dropObjects;
          },
          inc: function inc() {
            count++;
          },
          value: function value() {
            return count;
          }
        };
      }();
      var list = function () {

        return {
          add: function add(item, index, place) {
            var element = document.createElement('li');
            element.setAttribute('class', pattern.list.class);
            element.setAttribute('id', "" + pattern.list.id + index);
            document.getElementById(place).appendChild(element);

            var elementDivFile = document.createElement('div');
            elementDivFile.setAttribute('class', 'itemTextTrunc');
            document.getElementById("" + pattern.list.id + index).appendChild(elementDivFile);

            var elementSpanFile = document.createElement('span');
            elementSpanFile.setAttribute('id', "_as-FileItem-Name-" + index);
            elementDivFile.appendChild(elementSpanFile);
            elementSpanFile.innerHTML = item.name;

            var elementDivFileInfo = document.createElement('div');
            elementDivFileInfo.setAttribute('class', '_asDiv-ItemInfo');
            elementDivFile.appendChild(elementDivFileInfo);
            elementDivFileInfo.innerHTML = "Size: " + superbytes(item.size) + " | Type: " + item.type;

            var elementDivRemoveButton = document.createElement('div');
            elementDivRemoveButton.setAttribute('class', 'itemRemoveButton');
            element.appendChild(elementDivRemoveButton);

            var elementIBtn = document.createElement('i');
            elementIBtn.setAttribute('class', 'btn-act fa fa-times text-primary');
            elementIBtn.setAttribute('id', "_asI-FileItem-Rem-" + index);
            elementDivRemoveButton.appendChild(elementIBtn);
          },
          remove: function remove(id) {
            var res = id.split('-');
            var index = res[res.length - 1];
            document.getElementById("" + pattern.list.id + index).setAttribute('style', 'display: none;');
          }
        };
      }();

      var progress = function () {
        return {
          show: function show() {
            document.getElementById(pattern.progress.wrapperId).setAttribute('style', 'display: block;');
          },
          inc: function inc(value, loaded, total) {
            document.getElementById(pattern.progress.barId).setAttribute('style', "width: " + value + "%");
            document.getElementById(pattern.progress.barId).setAttribute('aria-valuenow', "" + value);
            document.getElementById(pattern.progress.infoId).innerHTML = value + "% | " + superbytes(loaded) + "/" + superbytes(total);
          }
        };
      }();

      return {
        input: input,
        drop: drop,
        list: list,
        test: test,
        progress: progress
      };
    };
  }, { "./asupload-pattern.js": 2, "./superbytes.js": 6 }], 5: [function (require, module, exports) {

    var as_proc = require('./asupload-proc.js');
    var as_patt = require('./asupload-pattern.js');
    var as_ui = require('./asupload-ui.js');

    var proc = as_proc();
    var pattern = as_patt();
    var ui = as_ui();

    (function () {
      'use strict';

      var idBtnAddFiles = '_asBtn-AddFiles';
      var idBtnSendFiles = '_asBtn-SendFiles';
      var idBtnSendFilesWrapper = '_asLi-SendFiles';
      var idBtnRemFile = '_asI-FileItem-Rem-';

      var idFrmInputs = '_asFrm-InputFiles';
      var idUlListFiles = '_asUl-ListFiles';
      var idSpanFileName = '_as-FileItem-Name-';

      var elBtnAddFiles = document.getElementById(idBtnAddFiles);
      var elBtnSendFiles = document.getElementById(idBtnSendFiles);

      var dropData = new FormData();

      document.addEventListener('DOMContentLoaded', function () {
        elBtnAddFiles.addEventListener('click', function (e) {
          addClick(e);
        });

        elBtnSendFiles.addEventListener('click', function (e) {
          e.preventDefault();
          ui.progress.show();

          document.getElementById(idBtnSendFilesWrapper).setAttribute('style', 'display: none');
          sendClick(e);
        });

        document.getElementById(pattern.dropzone.id).addEventListener('drop', function (e) {
          e.preventDefault();
          e.stopPropagation();

          addElementList(e.dataTransfer.files);
          for (var i = 0; i <= e.dataTransfer.files.length; i++) {
            dropData.append('userfile[]', e.dataTransfer.files[i]);
          }

          if (e.dataTransfer.files.length == 0) {
            toggleDragArea('dropText');
          } else {
            toggleDragArea('dropText');
          }
        });

        document.getElementById(pattern.dropzone.id).addEventListener('dragover', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });

        document.getElementById(pattern.dropzone.id).addEventListener('dragleave', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      });

      var toggleDragArea = function toggleDragArea(elementId) {
        if (proc.upload.files.getCount() == 0) {
          document.getElementById(elementId).setAttribute('style', 'display: flex');
        } else {
          document.getElementById(elementId).setAttribute('style', 'display: none');
        }
      };

      var addClick = function addClick(e) {
        ui.input.add(idFrmInputs);

        var currInput = "" + pattern.input.id + ui.input.value();
        var element = document.getElementById(currInput);
        element.click();

        element.addEventListener('change', function (e) {
          addElementList(e.target.files);
          toggleDragArea('dropText');
        });
      };

      var addElementList = function addElementList(filesObject) {
        var files = filesObject;
        for (var i = 0; i <= files.length - 1; i++) {
          if (proc.upload.files.add(files[i])) {
            proc.upload.files.inc();

            var fileCourse = proc.upload.files.getCourse();
            ui.list.add(files[i], fileCourse, idUlListFiles);

            document.getElementById("" + idBtnRemFile + fileCourse).addEventListener('click', function (e) {

              removeClick(e);
              toggleDragArea('dropText');
            });
          }
        }
      };

      var removeClick = function removeClick(e) {
        var res = e.target.id.split('-');
        var index = res[res.length - 1];

        var elem = document.getElementById("" + idSpanFileName + index);
        if (proc.upload.files.remove(elem.innerText)) {
          ui.list.remove(e.target.id);
        }
      };

      var sendClick = function sendClick(e) {
        var ar = ui.input.getAll();
        var c = ui.input.value();
        var inputObjects = [];

        for (var i = 1; i <= c; i++) {
          inputObjects.push(document.getElementById("" + pattern.input.id + i));
        }

        proc.upload.send('server/upload.php', proc.upload.prepare(inputObjects, dropData.getAll('userfile[]')), function (xhr) {
          xhr.upload.addEventListener('progress', function (e) {
            if (e.lengthComputable) {
              var percentComplete = e.loaded / e.total;
              percentComplete = parseInt(percentComplete * 100);
              ui.progress.inc(percentComplete, e.loaded, e.total);

              if (percentComplete === 100) {}
            }
          }, false);

          xhr.upload.addEventListener('loadstart', function (e) {}, false);
        });
      };
    })();
  }, { "./asupload-pattern.js": 2, "./asupload-proc.js": 3, "./asupload-ui.js": 4 }], 6: [function (require, module, exports) {

    module.exports = superbytes = function superbytes(bytes, arg1, arg2) {
      'use strict';

      var UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      bytes = Math.abs(bytes);
      var divider = void 0,
          si = void 0,
          digits = 0;

      if (arg1 === undefined && arg2 === undefined) {
        divider = 1024;
        digits = 2;
      }
      if (typeof arg1 === 'boolean') {
        if (arg1) {
          divider = 1000;
        } else {
          divider = 1024;
        }
        if (typeof arg2 === 'number') {
          digits = arg2;
        } else {
          digits = 2;
        }
      } else if (typeof arg1 === 'number') {
        digits = arg1;
        if (typeof arg2 === 'boolean') {
          if (arg2) {
            divider = 1000;
          } else {
            divider = 1024;
          }
        } else {
          divider = 1024;
        }
      }

      if (Number.isFinite(bytes)) {
        if (bytes < divider) {
          var num = bytes;
          return num + " " + UNITS[0];
        }

        for (var i = 1; i <= 8; i++) {
          if (bytes >= Math.pow(divider, i) && bytes < Math.pow(divider, i + 1)) {
            var _num = (bytes / Math.pow(divider, i)).toFixed(digits);
            return _num + " " + UNITS[i];
          }
        }
      }
    };
  }, {}] }, {}, [5]);

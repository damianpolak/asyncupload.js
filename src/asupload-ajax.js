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

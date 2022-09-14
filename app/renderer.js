const { ipcRenderer } = require('electron')

    var showBox = document.getElementById('show');
    var error = document.getElementById('error');

    showBox.addEventListener('click', (event) => {
      ipcRenderer.send("showMsgBox")
    });

    error.addEventListener('click', (event) => {
      ipcRenderer.send("showErrBox")
    });
const {app, BrowserWindow, globalShortcut} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
let win

const createWindow = () => {
  win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    titleBarStyle: 'hiddenInset',

  })
  win.webContents.session.webRequest.onHeadersReceived({ urls: [ "*://*/*" ] },
    (d, c)=>{
      if(d.responseHeaders['X-Frame-Options']){
        delete d.responseHeaders['X-Frame-Options'];
      } else if(d.responseHeaders['x-frame-options']) {
        delete d.responseHeaders['x-frame-options'];
      }

      c({cancel: false, responseHeaders: d.responseHeaders});
    }
  );
  win.maximize()

  win.loadURL(isDev
    ? 'http://localhost:8000/'
    : `file://${path.join(__dirname, './index.html')}`)
  if (isDev) {
  win.webContents.openDevTools();
  }
  win.once('ready-to-show', () => {
    win.show()
  })

//  registerAllShortcuts()
}

app.on('ready', createWindow)

app.on('browser-window-blur', () => {
//  globalShortcut.unregisterAll()
})

app.on('browser-window-focus', () => {
//  registerAllShortcuts()
})

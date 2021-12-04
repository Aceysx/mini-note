const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
require("./main-process/listener");

let win;

const createWindow = () => {
  win = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false
    },
    titleBarStyle: "hiddenInset"
  });
  win.webContents.session.webRequest.onHeadersReceived(
    { urls: ["*://*/*"] },
    (d, c) => {
      if (d.responseHeaders["X-Frame-Options"]) {
        delete d.responseHeaders["X-Frame-Options"];
      } else if (d.responseHeaders["x-frame-options"]) {
        delete d.responseHeaders["x-frame-options"];
      }

      c({ cancel: false, responseHeaders: d.responseHeaders });
    }
  );
  win.maximize();

  // win.loadURL(`file://${path.join(__dirname, './index.html')}`)
  win.loadURL("http://localhost:8000/");
  win.once("ready-to-show", () => {
    win.show();
  });

  //  registerAllShortcuts()
};

app.on("ready", createWindow);

app.on("browser-window-blur", () => {
  //  globalShortcut.unregisterAll()
});

app.on("browser-window-focus", () => {
  //  registerAllShortcuts()
});

const { app, BrowserWindow } = require('electron')
const process = require('process')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true,
      enableRemoteModule: true,
      sandbox:false,
      nodeIntegrationInSubFrames:true, //for subContent nodeIntegration Enable
      webviewTag:true, //for webView
    },
  })
  win.loadFile('index.html')
  win.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
  process.env.JSON_DOM_VIEWER_ARGV = process.argv[2]
  createWindow()
})


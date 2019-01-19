const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
  return
}

const pkg = require('./package.json')

const { app, BrowserWindow, shell, Tray, Menu, dialog } = require('electron')
const log = require('electron-log')
const i18next = require('i18next')
const path = require('path')

log.transports.file.appName = pkg.name
log.transports.file.level = 'info'
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'
log.transports.file.maxSize = 5 * 1024 * 1024


i18next.init({
  languages: ['en', 'cs'],
  fallbackLng: 'en',
  resources: {
    cs: {
      translation: {
        'title': 'Malá Heureka',
        'quit_app': 'Ukončit',
        'show_app': 'Zobrazit aplikaci',
        'msq_quit_title': 'Potvrďte ukončení',
        'msq_quit_question': 'Opravdu chcete ukončit Malá Heureka?',
        'msq_quit_yes': 'Ukončení aplikace',
        'msq_quit_cancel': 'Zrušit'
      }
    },
    en: {
      translation: {
        'title': 'Little Heureka',
        'quit_app': 'Quit',
        'show_app': 'Show App',
        'msq_quit_title': 'Confirm exit',
        'msq_quit_question': 'Are you sure want to exit Little Heureka?',
        'msq_quit_yes': 'Exit',
        'msq_quit_cancel': 'Cancel'
      }
    }
  }
})

let win

function createWindow () {
  // Create the browser window.
  log.info('Create window')
  log.info('Set local:', app.getLocale())
  i18next.changeLanguage(app.getLocale())

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    minWidth: 300,
    icon: path.resolve(__dirname, 'dist', 'favicon.ico'),
    title: i18next.t('title')
    // frame: false
  })

  win.setMenu(null)

  // and load the index.html of the app.
  win.loadFile(path.resolve(__dirname, 'dist', 'index.html'))

  // Open the DevTools.
  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })

  win.on('minimize', (event) => {
    event.preventDefault()
    win.hide()
  })

  win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })

  win.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault()
      msgQuit(win)
    }
    return false
  })

  createTray(win)
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    log.info('Quit app')
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

function createTray (win) {
  log.info('Create tray')
  var tray = new Tray(path.resolve(__dirname, 'dist', 'favicon.ico'))
  tray.setToolTip(i18next.t('title'))
  tray.setTitle(i18next.t('title'))

  tray.on('click', () => {
    win.show()
  })

  const contextMenu = Menu.buildFromTemplate([
    {
      label: i18next.t('show_app'),
      click: function () {
        win.show()
      }
    },
    {
      label: i18next.t('quit_app'),
      click: function () {
        log.info('Quit app')
        app.isQuiting = true
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
}

function msgQuit (window) {
  const options = {
    type: 'question',
    buttons: [ i18next.t('msq_quit_yes'), i18next.t('msq_quit_cancel') ],
    defaultId: 2,
    title: i18next.t('msq_quit_title'),
    message: i18next.t('msq_quit_question'),
    detail: null,
    checkboxChecked: false
  }

  dialog.showMessageBox(window, options, (response, checkboxChecked) => {
    if (response === 0) {
      log.info('Quit app')
      app.isQuiting = true
      app.quit()
    }
  })
}

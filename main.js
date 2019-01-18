const { app, BrowserWindow, shell, Tray, Menu } = require('electron')
const log = require('electron-log')
const i18next = require('i18next')
const path = require('path')

log.info(app.getLocale())
i18next.init({
  languages: ['en', 'cs'],
  fallbackLng: 'en',
  resources: {
    cs: {
      translation: {
        'title': 'Malá Heureka',
        'quit_app': 'Ukončit',
        'show_app': 'Zobrazit aplikaci'
      }
    },
    en: {
      translation: {
        'title': 'Little Heureka',
        'quit_app': 'Quit',
        'show_app': 'Show App'
      }
    }
  }
})

let win

function createWindow () {
  // Create the browser window.

  i18next.changeLanguage(app.getLocale())

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    minWidth: 300,
    icon: path.resolve(__dirname, 'dist', 'favicon.ico'),
    title: i18next.t('title')
  })

  // and load the index.html of the app.
  win.loadFile(path.resolve(__dirname, 'dist', 'index.html'))

  // Open the DevTools.
  //win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })

  win.on('minimize', function (event) {
    event.preventDefault()
    win.hide()
  })

  win.webContents.on('new-window', function (e, url) {
    e.preventDefault()
    shell.openExternal(url)
  })

  win.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault()
      win.hide()
    }

    return false
  })

  createTray(win)
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

function createTray (win) {
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
        app.isQuiting = true
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
}

//
// function handleSquirrelEvent(application) {
//   if (process.argv.length === 1) {
//     return false;
//   }
//
//   const ChildProcess = require('child_process');
//   const path = require('path');
//
//   const appFolder = path.resolve(process.execPath, '..');
//   const rootAtomFolder = path.resolve(appFolder, '..');
//   const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
//   const exeName = path.basename(process.execPath);
//
//   const spawn = function(command, args) {
//     let spawnedProcess, error;
//
//     try {
//       spawnedProcess = ChildProcess.spawn(command, args, {
//         detached: true
//       });
//     } catch (error) {}
//
//     return spawnedProcess;
//   };
//
//   const spawnUpdate = function(args) {
//     return spawn(updateDotExe, args);
//   };
//
//   const squirrelEvent = process.argv[1];
//   switch (squirrelEvent) {
//     case '--squirrel-install':
//     case '--squirrel-updated':
//       // Optionally do things such as:
//       // - Add your .exe to the PATH
//       // - Write to the registry for things like file associations and
//       //   explorer context menus
//
//       // Install desktop and start menu shortcuts
//       spawnUpdate(['--createShortcut', exeName]);
//
//       setTimeout(application.quit, 1000);
//       return true;
//
//     case '--squirrel-uninstall':
//       // Undo anything you did in the --squirrel-install and
//       // --squirrel-updated handlers
//
//       // Remove desktop and start menu shortcuts
//       spawnUpdate(['--removeShortcut', exeName]);
//
//       setTimeout(application.quit, 1000);
//       return true;
//
//     case '--squirrel-obsolete':
//       // This is called on the outgoing version of your app before
//       // we update to the new version - it's the opposite of
//       // --squirrel-updated
//
//       application.quit();
//       return true;
//   }
// };

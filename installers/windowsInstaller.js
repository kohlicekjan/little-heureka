const pkg = require('../package.json')

const electronInstaller = require('electron-winstaller')
const path = require('path')

const rootPath = path.join(__dirname, '../')
const outPath = path.join(rootPath, 'bin', 'win')

console.log('Creating the installation file')

var settings = {
  appDirectory: path.join(outPath, 'little-heureka-win32-x64'),
  outputDirectory: path.join(outPath, 'windows-installer'),
  authors: pkg.author,
  noMsi: true,
  exe: pkg.name + '.exe',
  setupExe: pkg.name + '-v' + pkg.version + '-setup.exe',
  setupIcon: path.resolve(rootPath, 'dist', 'favicon.ico')
}

var resultPromise = electronInstaller.createWindowsInstaller(settings)

resultPromise.then(() => console.log('An installation file was created'), (e) => console.log(e.message || e))

const path = require('path');
const rootPath = path.join('./');
const outPath = path.join(rootPath, 'release-builds');
var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: path.join(outPath, 'table-generator-win32-x64'),
  outputDirectory: path.join(outPath, 'installer32'),
  authors: 'Krystian Ostrowski',
  exe: 'table-generator.exe'
});

resultPromise.then(() => console.log("It worked!"),
(e) => console.log(`No dice: ${e.message}`));
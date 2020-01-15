const { app, BrowserWindow, Menu, ipcMain, autoUpdater, shell, globalShortcut } = require('electron');
const config = require('./config.json');
const path = require('path');
const fs = require('fs');
const os = require('os');

const server = 'http://krystian-ostrowski.webd.pro';                //URL to update's server
const feed = `${server}/update?v=${app.getVersion()}`;              //path to updates directory on server

//console.log(process.platform, app.getVersion());
if(handleSquirrelEvent()) {
    return;
}

function handleSquirrelEvent() {
    if(process.argv.length === 1)
        return false;

    const ChildProcess = require('child_process');
    const squirrelEvents = process.argv[1];
    
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);
    
    const spawn = (command, args) => {
        let spawnedProcess, error;
    
        try
        {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        }
        catch(error) {}
    
        return spawnedProcess;
    };
    
    const spawnUpdate = args => {
        return spawn(updateDotExe, args);
    }
    
    switch(squirrelEvents)
    {
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName]);
    
            setTimeout(app.quit, 1000);
            return true;
    
        case '--squirrel-uninstall':
            spawnUpdate(['--removeShortcut', exeName]);
    
            setTimeout(app.quit, 1000);
            return true;
    
        case '--squirrel-obsolete':
            app.quit();
            return true;
    }  
};

let win;   //window instance

const menuTemplate = [
    {
        label: 'Grupy',
        submenu: [
            {
                label: 'Dodaj',
                click: () => {
                    win.webContents.send('render-modal', { modal: 'add-group' });
                }
            },
            {
                label: 'Usuń',
                click: () => {
                    win.webContents.send('render-modal', { modal: 'del-group' });
                }
            },
            /*{
                label: 'Zarządzaj członkami (Experimental)',
                click: () => {
                    if(config.enableExperimental)
                        win.webContents.send('render-modal', { modal: 'manage-group-members' });
                }
            }*/
        ]
    },
    {
        label: 'Osoby',
        submenu: [
            {
                label: 'Dodaj',
                click: () => {
                    win.webContents.send('render-modal', { modal: 'add-person' });
                }
            },
            {
                label: 'Zarządzaj',
                click: () => {
                    win.webContents.send('render-modal', { modal: 'manage-persons' });
                }
            }
        ]
    },
    {
        label: 'Drukuj',
        click: () => {
            win.webContents.send('print');
        },
    }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

//create app window
const createWindow = () => {

    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        backgroundColor: '#212121',
        frame: false,
        minimizable: false,
        resizable: false,
        movable: false,   
        webPreferences: {
            nodeIntegration: true
        }
    });

    //maximalize window
    win.maximize();

    //load index.html
    win.loadFile('./html/index.html');

    //called when window is closed
    win.on('closed', () => {
        win = null;
    });

    //checking for update
    if(!config.devBuild)
    {
        autoUpdater.setFeedURL(feed);
        autoUpdater.checkForUpdates();
    }

    if(config.devBuild)
    {
        globalShortcut.register('f5', () => {
            win.reload();
            console.log("Reloaded Window");
        });

        //open dev tools
        win.webContents.openDevTools();
    }
};

//initialize app window
app.on('ready', createWindow);

app.on("window-all-closed", () => {
    if(process.platform !== "darwin")
        app.quit();
});

app.on('activate', () => {
    if(win === null)
        createWindow();

        console.log(x.id);
});

//update available
autoUpdater.on('update-available', () => {
    shell.openExternal('http://krystian-ostrowski.webd.pro/update/changelog.html');
    win.webContents.send('downloading-update');
});

autoUpdater.on('update-progress', (progressObj) => console.log(`Downloading. Speed: ${progressObj.bytesPerSeconnd} Downloaded: ${progressObj.percent}%`));

//called when update downloaded
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => win.webContents.send('downloaded-update'));

//install update
ipcMain.on('install--update', () => autoUpdater.quitAndInstall());

//printing
ipcMain.on('print-to-pdf', (event) => {
    const pdfPath = path.join(os.tmpdir(), 'print.pdf');
    win.webContents.printToPDF({
        pageSize: 'A4',
        marginsType: 2
    }, (error, data) => {
        if(error) return console.log(error.message);

        fs.writeFile(pdfPath, data, (err) => {
            if(err) return console.log(err.message);

            shell.openExternal('file://' + pdfPath);

            /*if(config.enableExperimental)
                setTimeout(() => event.sender.send('wrote-pdf', pdfPath), 500);*/
        });
    });
});

ipcMain.on('remove-PDF', (event, path) => {
    fs.unlink(path, (error) => {
        if(error)
            return console.log(error);

        console.log(`Removed: ${path}`);
    });
});
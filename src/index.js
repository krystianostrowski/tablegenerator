const { app, BrowserWindow, Menu, ipcMain, autoUpdater, dialog, shell, globalShortcut } = require('electron');
const config = require('./config.json');
const path = require('path');
const fs = require('fs');
const os = require('os');

const server = 'http://krystian-ostrowski.webd.pro';                        //URL to update's server
const feed = `${server}/update?v=${app.getVersion()}`;    //path to updates directory on server

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
            {
                label: 'Zarządzaj członkami (Experimental)',
                click: () => {
                    if(config.enableExperimental)
                        win.webContents.send('render-modal', { modal: 'manage-group-members' });
                }
            }
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

autoUpdater.on('update-available', () => {
    const dialogOpts = {
        type: 'info',
        title: 'Aktualizacja',
        detail: 'Proszę czekać. Trwa pobieranie aktualizacji'
    }

    dialog.showMessageBox(dialogOpts, response => {
        console.log(response);
    });
})

//called when update downloaded
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Updater',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    };

    dialog.showMessageBox(dialogOpts, (response) => {
        if(response === 0)
            autoUpdater.quitAndInstall();
    });
});

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
            event.sender.send('wrote-pdf', pdfPath);
        });
    });
});

const { app, BrowserWindow, Menu, ipcMain, autoUpdater, dialog, shell, globalShortcut } = require('electron');
const config = require('./config.json');
const path = require('path');
const fs = require('fs');
const os = require('os');

const server = 'http://krystian-ostrowski.webd.pro';                        //URL to update's server
const feed = `${server}/update?v=${app.getVersion()}`;    //path to updates directory on server

console.log(process.platform, app.getVersion());

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
        width: config.appWidth,
        height: config.appHeight,
        backgroundColor: '#212121',
        frame: false,
        minimizable: false,
        resizable: false,
        movable: false,   
        webPreferences: {
            nodeIntegration: true
        }
    });

    globalShortcut.register('f5', () => {
        win.reload();
        console.log("Reloaded Window");
    });

    //maximalize window
    win.maximize();

    //load index.html
    win.loadFile('./html/index.html');

    //open dev tools
    win.webContents.openDevTools();

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

autoUpdater.on('checking-for-update', () => {
    const dialogOpts = {
        type: 'info',
        buttons: ['OK'],
        title: 'Tak',
    }

    dialog.showMessageBox(dialogOpts, response => {
        console.log(response);
    });
})

autoUpdater.on('update-available', () => {
    const dialogOpts = {
        type: 'info',
        buttons: ['OK'],
        title: 'Aktualizacja',
        detail: 'Dostępna jest nowa wersja aplikacji.'
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
    win.webContents.printToPDF({}, (error, data) => {
        if(error) return console.log(error.message);

        fs.writeFile(pdfPath, data, (err) => {
            if(err) return console.log(err.message);

            shell.openExternal('file://' + pdfPath);
            event.sender.send('wrote-pdf', pdfPath);
        });
    });
});

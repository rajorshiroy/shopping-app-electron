const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const url = require('url');
const path = require('path');


let mainWindow;
let addWindow;

// listen for app to be ready
app.on('ready', () => {
    // create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    // load html file into the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main-window.html'),
        protocol: 'file:',
        slashes: true
    }));

    // handle garbage collection
    // addWindow.on('close', () => addWindow = null);

    // close all windows when app is closed
    mainWindow.on('closed', () => app.quit())

    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // insert the menubar
    Menu.setApplicationMenu(mainMenu);
})

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Items', click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items', click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                }
            },
        ]
    },

]

// catch item:add
ipcMain.on('item:add', (event, item) => {
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

const createAddWindow = () => {
// create add window
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 300,
        height: 200,
        title: 'Shopping List Item'
    });

    // load html file into the window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'add-window.html'),
        protocol: 'file:',
        slashes: true
    }));
}

// push an empty menu object on mac
if (process.platform === 'darwin')
    mainMenuTemplate.unshift({});


// add developer tools menu on dev build
if (process.env.NODE_ENV !== 'production')
    mainMenuTemplate.push({
            label: 'Developer Toold',
            submenu: [
                {
                    label: 'Toggle Dev Tools',
                    accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {role: 'reload'}
            ]
        }
    )

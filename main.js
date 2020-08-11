const electron = require('electron');
const url = require('url');
const path = require('path');


const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let addWindow;

// listen for app to be ready
app.on('ready', () => {
    // create new window
    mainWindow = new BrowserWindow();

    // load html file into the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main-window.html'),
        protocol: 'file:',
        slashes: true
    }));

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
            {label: 'Clear Items'},
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


const createAddWindow = () => {
// create add window
    addWindow = new BrowserWindow({
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

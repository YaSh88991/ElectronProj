const { app, BrowserWindow, Menu, ipcMain, Notification, } = require('electron')
const elecDialog = require('electron').dialog
const log = require('electron-log')


log.transports.file.resolvePath=()=> __dirname + '/logs/log.log'
process.env.NODE_ENV = 'production'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow
let aboutWindow

const NOTIFICATION_TITLE = 'Success Notification'
const NOTIFICATION_BODY = 'Form Submitted Successfully!!'

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Electron-Demo',
        width: isDev ? 500 : 500,
        height: 600,
        resizable: isDev,
        backgroundColor: 'ivory',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        }
    })
    // If the app is in dev mode
    if (isDev) {
        mainWindow.webContents.openDevTools()
    }
    mainWindow.loadFile('./app/html/popup.html')
    //console.log(__dirname);
}

function createAboutWindow() {
    aboutWindow = new BrowserWindow({
        title: 'Electron-Demo',
        width: isDev ? 300 : 300,
        height: 300,
        resizable: isDev,
        backgroundColor: 'gold',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    aboutWindow.loadFile('./app/about.html')

}

app.on('ready', () => {
    createMainWindow()

    //menu
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    //Logs
    log.info('Hello from electron demo/main.js , Main window is created now')

    // globalShortcut.register('CmdOrCtrl+R',()=>mainWindow.reload())
    // globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I',()=>mainWindow.toggleDevTools())
    mainWindow.on('closed', () => (mainWindow = null))
})

//menu template
const menu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {
                label: 'About',
                click: createAboutWindow
            }
        ]
    }] : []),

    {
        role: 'fileMenu'
    },
    ...(!isMac ? [
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow
                }
            ]
        }
    ] : []),
    {
        label: 'View',
        submenu: [
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { role: 'togglefullscreen' },
            { role: 'toggleDevTools' }
        ]
    },
    ...(isDev ? [
        {
            label: 'Developer',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { type: 'separator' },
                { role: 'toggleDevTools' }
            ]
        }] : [])
]

function showNotification() {
    new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
    log.info('user submitted a form!')
}

ipcMain.on("btnPressed", () => {
    app.whenReady().then(showNotification)
})

//dialog box
ipcMain.on("showMsgBox", () => {
    // Resolves to a Promise<Object>
    elecDialog.showMessageBox({
        // option Object
        type: 'warning',
        buttons: ['Cancel', 'OK'],
        defaultId: 0,
        icon: '/assets/icon/win/icon.ico',
        title: 'POPUP MESSAGE DEMO',
        message: 'You are now viewing a custom message',
        detail: 'This is extra Information',
        checkboxLabel: 'Checkbox',
        checkboxChecked: false,
        cancelId: 0,
        noLink: false,
        normalizeAccessKeys: false,
    }).then(box => {
        log.info('Button Clicked Index - ', box.response);
        log.info('Checkbox Checked - ', box.checkboxChecked);
            if (box.response === 0) {
            console.log('Cancel Button was clicked');
        } else if (box.response === 2) {
            console.log('Button-1 was clicked');
        }
    }).catch(err => {
        console.log(err)
    });
});


ipcMain.on('showErrBox', () => {
    elecDialog.showErrorBox("Error Box", "An Error Occoured")
    log.error('an error occoured')
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});


app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});
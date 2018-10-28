const {app, BrowserWindow} = require('electron');
const ipcMain = require('electron').ipcMain;
const path = require('path');
const url = require('url');
var robot = require("robotjs");

// Disable GPU rendering since OBS doesn't support it
app.disableHardwareAcceleration();

// TODO: set to 100 for twitch
// mouse delay in ms after an action completes
robot.setMouseDelay(200);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 1920, height: 1080});
    win.setMenu(null);
    win.setFullScreen(true);

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'web/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    // win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.exit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('winner_line', function(event, data) {
    robot.moveMouse(data.x1, data.y1);
    robot.mouseToggle("down");
    robot.dragMouse(data.x2, data.y2);
    robot.mouseToggle("up");
    hideMouse();
});

ipcMain.on('emote', function(event, emoteId) {
    // Move mouse on player potrait
    robot.moveMouse(998, 788);
    robot.mouseClick("right");

    var x = 0;
    var y = 0;

    switch (emoteId)
    {
        case "greetings":
            x = 770;
            y = 836;
            break;
        case "wellplayed":
            x = 770;
            y = 768;
            break;
        case "thanks":
            x = 770;
            y = 684;
            break;
        case "threaten":
            x = 1146;
            y = 836;
            break;
        case "oops":
            x = 1146;
            y = 768;
            break;
        case "wow":
            x = 1146;
            y = 684;
            break;
    }

    robot.moveMouse(x, y);
    robot.mouseClick("left");
    hideMouse();
});

function hideMouse() {
    // TODO: don't go to bottom left corner in chaos mode
    // Move mouse to bottom left corner so it's not visible
    robot.moveMouse(0, 1080);
}
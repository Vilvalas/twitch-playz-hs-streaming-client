var playerWrapper = $("#playerWrapper");
var arrowCanvas = $("#arrowCanvas");
// var currentViewersNumber = $("#currentViewersNumber");
var arrowCanvasDOM = document.getElementById("arrowCanvas");
var context = arrowCanvasDOM.getContext("2d");

var arrowHeadLength = 20;
var turnDuration = 5;
var circleRadius = 10;

// var lineColor = '#00BFFF';
var lineColor = '#FFFFFF';

var lineColorInvalid = '#FF4500';
// var lineColorInvalid = '#FF0000';

var lineColorWinner = '#0000FF';

var ipcRenderer = require("electron").ipcRenderer;

var hostname = 'https://twitchplayshs.xyz/server-client';
// var hostname = 'http://127.0.0.1:8080/server-client';

// animation: "ticks" for better performance (~4% cpu)
$("#countDownTimer").TimeCircles({
    time: { Days: { show: false }, Hours: { show: false }, Minutes: { show: false }, Seconds: { show: true, text: "", color: "#9CF" }},
    fg_width: 0.2, //  sets the width of the foreground circle.
    bg_width: 0.75, // sets the width of the backgroundground circle.
    count_past_zero: false,
    total_duration: turnDuration,
    animation: "smooth"
});

// This gets called from TimeCircles.js
function countdownComplete() {
    // Not needed atm
}

$(document).ready(function() {

    /* This is not needed for server client
    $(window).resize(function() {
        positionCanvasOverStream();
    });
    */

    positionCanvasOverStream();

    var socket = io.connect(hostname);

    socket.on('line', function (data) {
        drawLine(data.line, lineColor);
        updateClientCount(data.numberOfClients);
    });

    socket.on('invalid_line', function (data) {
        drawLine(data.line, lineColorInvalid);
        updateClientCount(data.numberOfClients);
    });

    socket.on('winner_line', function (data) {
        drawLine(data.line, lineColorWinner);
        ipcRenderer.send('winner_line', data.line);

        updateClientCount(data.numberOfClients);
    });

    socket.on('new_input_turn', function (data) {
        // Clear canvas
        context.clearRect(0, 0, arrowCanvasDOM.width, arrowCanvasDOM.height);
        // Restart timer
        $("#countDownTimer").TimeCircles().restart();
        updateClientCount(data.numberOfClients);
    });

    socket.on('emote', function (data) {
        // Send to main process
        ipcRenderer.send('emote', data.emoteId);
    });

    /* test data
    drawLine({x1: 100, y1: 200, x2: 800, y2: 500}, lineColor);
    drawLine({x1: 200, y1: 400, x2: 600, y2: 540}, lineColorInvalid);
    drawLine({x1: 1920, y1: 1080, x2: 60, y2: 60}, lineColorWinner);
    */
});

function positionCanvasOverStream() {
    arrowCanvas.width(playerWrapper.width());
    arrowCanvas.height(playerWrapper.height());

    // arrowCanvasDOM.style.top = "" + playerWrapper.offset().top + "px";
    // arrowCanvasDOM.style.left = "" + playerWrapper.offset().left + "px";
    arrowCanvasDOM.width = playerWrapper.width();
    arrowCanvasDOM.height = playerWrapper.height();
}

function updateClientCount(numberOfClients) {
    // currentViewersNumber.text(numberOfClients);
}

function drawLine(line, colorString) {
    context.strokeStyle = colorString;
    context.fillStyle = colorString;

    if(line.circle) {
        drawCircle(line.x1, line.y1, true);
    } else {
        drawArrow(line.x1, line.y1, line.x2, line.y2);
    }
}

function drawCircle(xpos, ypos, fill) {
    context.lineWidth = 1;
    context.beginPath();
    context.arc(xpos, ypos, circleRadius, 0, 2 * Math.PI);
    context.stroke();

    if (fill) {
        context.fill();
    }
}

function drawArrow(fromx, fromy, tox, toy) {
    // Start the arrow with a circle
    drawCircle(fromx, fromy, true);

    context.lineWidth = 6;
    var angle = Math.atan2(toy - fromy, tox - fromx);

    //starting path of the arrow from the start square to the end square and drawing the stroke
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.stroke();

    /* Alternative version for full arrowhead
    //starting a new path from the head of the arrow to one of the sides of the point
    context.beginPath();
    context.moveTo(tox, toy);
    context.lineTo(tox - (arrowHeadLength * Math.cos(angle - Math.PI / 7)), toy - (arrowHeadLength * Math.sin(angle - Math.PI / 7)));

    //path from the side point of the arrow, to the other side point
    context.lineTo(tox - (arrowHeadLength * Math.cos(angle + Math.PI / 7)), toy - (arrowHeadLength * Math.sin(angle + Math.PI / 7)));

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    context.lineTo(tox, toy);
    // context.lineTo(tox - (arrowHeadLength * Math.cos(angle - Math.PI / 7)), toy - (arrowHeadLength * Math.sin(angle - Math.PI / 7)));
    */

    //starting a new path from the head of the arrow to one of the sides of the point
    context.beginPath();
    context.moveTo(tox, toy);
    context.lineTo(tox - (arrowHeadLength * Math.cos(angle + Math.PI / 7)), toy - (arrowHeadLength * Math.sin(angle + Math.PI / 7)));
    context.stroke();

    //starting a new path from the head of the arrow to one of the sides of the point
    context.beginPath();
    context.moveTo(tox, toy);
    context.lineTo(tox - (arrowHeadLength * Math.cos(angle - Math.PI / 7)), toy - (arrowHeadLength * Math.sin(angle - Math.PI / 7)));


    context.stroke();
    // context.fill();
}
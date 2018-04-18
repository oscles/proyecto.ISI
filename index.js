const express = require('express');
const app = express();
const http = require('http').Server(app);
const path  = require('path');
const io = require("socket.io")(http);
const five = require('johnny-five');
const board = new five.Board({port: 'COM6'});
//const proto = require('./models/proto');

var leds = [ //Para no usar la base de datos aún
    {
        pin: 2,
        status: Boolean
    }, 
    {
        pin: 3,
        status: Boolean
    },
    {
        pin: 4,
        status: Boolean
    },
    {
        pin: 5,
        status: Boolean
    },

]

for(var i=0; i<3; i++)
    leds[i].status = false;


app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

io.on('connection', function(socket){

    socket.on('status', function(){
        getLeds(socket);
    });

    socket.on('toggle', function(pin){
        toggleLed(parseInt(pin));
    });
});

board.on("ready", function(){ 
    http.listen(8080, console.log('Escuchando puerto 8080'));
});

function toggleLed(n){
    let led = new five.Led(n);
    if(leds[n-2].status) 
        led.off();
    else led.on();
    leds[n-2].status = !leds[n-2].status;
}

function getLeds(socket){
    socket.emit('status', leds);
}
var net = require('net');

var host='192.168.11.14';

var client = new net.Socket();

var commands=[
    'G01 X900 Y300 Z0',
    'G01 X900 Y-300 Z0',
    'G01 X900 Y-300 Z1000',

    'G01 X1200 Y300 Z0',
    'G01 X1200 Y-300 Z0',
    'G01 X1200 Y-300 Z1000',

    'G01 X900 Y0 Z0',
    'G01 X1200 Y0 Z0',
    'G01 X1200 Y0 Z1000',

    'G01 X1500 Y150 Z0',
    'G01 X1500 Y-300 Z0',
    'G01 X1500 Y-300 Z1000',

    'G01 X1500 Y250 Z0',
    'G01 X1500 Y300 Z0',
    'G01 X1500 Y300 Z1000',
];

var cmdIndex=0;

client.connect(1337, host, function() {
    console.log('Connected');
    cmdIndex=-1;
});

client.on('data', function(data) {
    console.log('Received: ' + data);
    
    // last command (or connecting) was successfull, so let's send a new command
    if(data.indexOf("hello")==0 || data.indexOf("ok ")==0)
    {
        cmdIndex++;
        console.log('Sending: '+commands[cmdIndex]);
        client.write(commands[cmdIndex]+'\x00\n');
    }
    
    if(data.indexOf('error')==0)
    {
        console.log('Error in command '+cmdIndex);
        console.log('Disconnecting...');
        client.destroy();
    }

    // reached end of command array
    if(cmdIndex==commands.length)
    {
        console.log('Finished!');
        client.destroy();
    }
});

client.on('close', function() {
	console.log('Connection closed');
});


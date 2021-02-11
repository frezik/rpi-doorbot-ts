# RPi Doorbot.ts

Interfaces Doorbot.ts to the Raspberry Pi.

# Setup

After cloning from github, run `npm install .` to install the prereqs. You can 
run the tests with `npm test`.

# Example

Here's an example of reading entries from a Wiegand reader, using pins 12 
and 13 as data 0 and 1, respectively.  This uses an `AlwaysAuthenticator`, so 
all reads will pass through. Once it does, GPIO pin 22 will be turned on for 
30 seconds.

(This uses an external program to read the Wiegand data. You can get that at:
https://github.com/frezik/wiegand_pigpio)

```
import * as Doorbot from '@frezik/doorbot-ts';
import * as RPi from '@frezik/rpi-doorbot-ts';
import * as Bodgery from '@bodgery/bodgery-doorbot-ts';


const PIN = 22;
const DATA0 = 12;
const DATA1 = 13;
const OPEN_TIME_MS = 30000;

Doorbot.init_logger( "/home/pi/doorbot/doorbot.log"  )

// Launch wiegand reader program as its own process. Run its STDOUT into
// an fs reader.

const wiegand = Process.spawn( WIEGAND_PROGRAM, [
    DATA0.toString()
    ,DATA1.toString()
]);
wiegand.on( 'error', (err) => {
    Doorbot.log.error( '<Main> Error starting Wiegand reader: ' + err );
    process.exit(1);
});
wiegand.on( 'exit', (code, signal) => {
    Doorbot.log.error( '<Main> Wiegand reader exited with code ' + code );
    process.exit(1);
});
wiegand.stderr.on( 'data', (data) => {
    Doorbot.log.info( '<Main> Wiegand reader stderr: ' + data );
});


const reader = new Doorbot.FHReader( wiegand.stdout );
const auth = new Doorbot.AlwaysAuthenticator();
const act = new RPi.GPIOActivator( PIN, OPEN_TIME_MS );

reader.init();
act.init();

reader.setAuthenticator( auth );
auth.setActivator( act );

reader
    .run()
    .then( (res) => {} );
```

If you save this to `/home/pi/doorbot/index.ts`, you can run it at 
startup with the following systemd service:

```
# /etc/systemd/system/rfid.service
[Unit]
Description=RFID Doorbot
After=getty.target rfid_db.service

[Service]
ExecStart=/usr/local/bin/ts-node /home/pi/doorbot/index.ts
Restart=on-abort

[Install]
WantedBy=multi-user.target
```

Save this to `/etc/syistemd/system/rfid.service`. You can start it with 
`sudo systemctl start rfid`, and if it works, have it come up at startup with 
`sudo systemctl enable rfid`.

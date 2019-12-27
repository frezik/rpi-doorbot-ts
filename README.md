# RPi Doorbot.ts

Interfaces Doorbot.ts to the Raspberry Pi. This allows you to read entries from 
a keyboard or a Wiegand reader, and to activate things over GPIO.

# Setup

After cloning from github, run `npm install .` to install the prereqs. You can 
run the tests with `npm test`.

# Example

Here's an example of reading entries from a Wiegand reader, using pins 12 
and 13 as data 0 and 1, respectively.  This uses an `AlwaysAuthenticator`, so 
all reads will pass through. Once it does, GPIO pin 22 will be turned on for 
30 seconds.

```
import * as Doorbot from '@frezik/doorbot-ts';
import * as RPi from '@frezik/rpi-doorbot-ts';
import * as Bodgery from '@bodgery/bodgery-doorbot-ts';


const PIN = 22;
const DATA0 = 12;
const DATA1 = 13;
const OPEN_TIME_MS = 30000;

Doorbot.init_logger( "/home/pi/doorbot/doorbot.log"  )


const reader = new RPi.WiegandReader( DATA0, DATA1 );
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

import * as tap from 'tap';
import * as Doorbot from '@frezik/doorbot-ts';
import * as RPi from '../index';
import * as os from 'os';

const PIN = 4;

Doorbot.init_logger( os.tmpdir() + "/doorbot_test.log"  );
tap.plan( 1 );


const act = new RPi.GPIOActivator( PIN, 1000 );

act
    .init()
    .then( (res) => {
        act
            .activate()
            .then( (res) => {
                tap.pass( "GPIO activated" );
            });
    });

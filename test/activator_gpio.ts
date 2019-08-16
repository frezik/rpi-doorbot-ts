import * as tap from 'tap';
import * as Doorbot from '@frezik/doorbot-ts';
import * as RPi from '../index';

const PIN = 4;

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

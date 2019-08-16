import * as tap from 'tap';
import * as Doorbot from '@frezik/doorbot-ts';
import * as RPi from '../index';

tap.plan( 2 );


const act = new RPi.GPIOActivator( 27, 1000 );
tap.ok( act, "Got an activator" );


tap.skip( "Not on a Raspberry Pi", {}, () => {
    act
        .init()
        .then( (res) => {
            act
                .activate()
                .then( (res) => {
                    tap.pass( "GPIO activated" );
                });
        });
});

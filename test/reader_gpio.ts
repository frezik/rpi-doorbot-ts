import * as tap from 'tap';
import * as Doorbot from '@frezik/doorbot-ts';
import * as RPi from '../index';

tap.plan( 2 );


const always = new Doorbot.AlwaysAuthenticator();
const act = new Doorbot.DoNothingActivator( () => {
    tap.pass( "Callback made" );
});

const gpio_reader = new RPi.GPIOReader( 25 );
tap.ok( gpio_reader instanceof Doorbot.Reader,
    "gpio reader is a Reader" );


tap.skip( "Not on a Raspberry Pi", {}, () => {
    gpio_reader.init().then( () => {
        gpio_reader.setAuthenticator( always );
        always.setActivator( act );


        gpio_reader
            .runOnce()
            .then( (res) => {} );
    });
});

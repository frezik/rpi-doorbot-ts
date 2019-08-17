import * as tap from 'tap';
import * as Doorbot from '@frezik/doorbot-ts';
import * as RPi from '../index';

const PIN = 27;

tap.plan( 2 );


const always = new Doorbot.AlwaysAuthenticator();
const act = new Doorbot.DoNothingActivator( () => {
    tap.pass( "Callback made" );
    process.exit();
});

tap.comment( "Once first test has hit, connect pin " + PIN + " to a 5V pin" );

const gpio_reader = new RPi.GPIOReader( PIN );
tap.ok( gpio_reader instanceof Doorbot.Reader,
    "gpio reader is a Reader" );



gpio_reader.init().then( () => {
    gpio_reader.setAuthenticator( always );
    always.setActivator( act );

    gpio_reader
        .run()
        .then( (res) => {} );
});

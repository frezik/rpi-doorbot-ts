import * as tap from 'tap';
import * as Doorbot from '@frezik/doorbot-ts';
import * as RPi from '../index';
import * as os from 'os';

const PIN_D0 = 17;
const PIN_D1 = 18;

Doorbot.init_logger( os.tmpdir() + "/doorbot_test.log"  )
tap.plan( 2 );


const always = new Doorbot.AlwaysAuthenticator();
const act = new Doorbot.DoNothingActivator( () => {
    tap.pass( "Callback made" );
    process.exit();
});

tap.comment( "Once first test has hit, scan fob" );

const wiegand_reader = new RPi.WiegandReader( PIN_D0, PIN_D1 );
tap.ok( wiegand_reader instanceof Doorbot.Reader,
    "weigand reader is a Reader" );

wiegand_reader.setAuthenticator( always );
always.setActivator( act );


wiegand_reader.init().then( () => {
    wiegand_reader
        .run()
        .then( (res) => {} );
});

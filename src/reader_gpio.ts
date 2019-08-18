import * as Doorbot from '@frezik/doorbot-ts';
import * as rpi from 'rpi-gpio';


export class GPIOReader extends Doorbot.Reader
{
    private pin;
    private previous_read = 0;


    constructor( pin: number )
    {
        super();

        this.pin = pin;
        Doorbot.init_logger();
    }


    init(): Promise<any>
    {
        rpi.setMode( rpi.MODE_BCM );

        Doorbot.log.info( '<Rpi.GPIOReader> Setting up on pin ' + this.pin );
        const promise = rpi.promise.setup(
            this.pin
            ,rpi.DIR_IN
            ,rpi.EDGE_RISING
        );
        return promise;
    }

    runOnce(): Promise<any>
    {
        const promise = rpi.promise
            .read( this.pin )
            .then( (is_active) => {
                let return_promise;

                if( is_active && (this.previous_read == 0) ) {
                    Doorbot.log.info( '<Rpi.GPIOReader> Pin ' + this.pin 
                        + ' is now active' );
                    const data = new Doorbot.ReadData( "1" );
                    const auth_promise = this.auth.authenticate( data );
                    return_promise = auth_promise;
                }
                else {
                    // Not active, return dummy promise
                    return_promise = new Promise( (resolve, reject) => {
                        resolve( false );
                    });
                }

                this.previous_read = is_active;
                return return_promise;
            });
        return promise;
    }
}

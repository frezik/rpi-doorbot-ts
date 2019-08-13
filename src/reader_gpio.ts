import * as Doorbot from '@frezik/doorbot-ts';
import * as rpi from 'rpi-gpio';


export class GPIOReader extends Doorbot.Reader
{
    private pin;


    constructor( pin: number )
    {
        super();

        this.pin = pin;
    }


    init(): Promise<any>
    {
        const promise = rpi.promise.setup( this.pin, rpi.DIR_IN );
        return promise;
    }

    runOnce(): Promise<any>
    {
        const promise = rpi.promise
            .read( this.pin )
            .then( (is_active) => {
                if( is_active ) {
                    const data = new Doorbot.ReadData( "1" );
                    const auth_promise = this.auth.authenticate( data );
                    return auth_promise;
                }
                else {
                    // Not active, return dummy promise
                    return new Promise( (resolve, reject) => {
                        resolve( false );
                    });
                }
            });
        return promise;
    }
}

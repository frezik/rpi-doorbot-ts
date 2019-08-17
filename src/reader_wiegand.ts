import * as Doorbot from '@frezik/doorbot-ts';
import * as rpi from 'rpi-gpio';
import * as wiegand from 'wiegand';


export class WiegandReader extends Doorbot.Reader
{
    private d0_pin: number;
    private d1_pin: number;
    private wiegand = wiegand();


    constructor(
        d0_pin: number
        ,d1_pin: number
    )
    {
        super();

        this.d0_pin = d0_pin;
        this.d1_pin = d1_pin;
    }


    init(): Promise<any>
    {
        rpi.setMode( rpi.MODE_BCM );

        const promises = [
            rpi.promise.setup( this.d0_pin, rpi.DIR_IN, rpi.EDGE_BOTH )
            ,rpi.promise.setup( this.d1_pin, rpi.DIR_IN, rpi.EDGE_BOTH )
        ];

        const main_promise = new Promise( (resolve, reject) => {
            Promise
                .all( promises )
                .then( (_) => {
                    this.wiegand.begin({
                        d0: this.d0_pin
                        ,d1: this.d1_pin
                    });

                    this.wiegand.on( 'reader', (id) => {
                        // Need to pad ID to 10 digits with leading zeros
                        let str_id = String( id );
                        let id_len = str_id.length;
                        let zero_pad_len = 10 - id_len;
                        if( zero_pad_len < 0 ) zero_pad_len = 0;
                        str_id = "0".repeat( zero_pad_len ) + str_id;

                        console.log( "[WIEGAND] Read string " + str_id );
                        const data = new Doorbot.ReadData( id );
                        const auth_promise = this.auth.authenticate( data );
                        auth_promise.then( () => {
                            resolve();
                        });
                    });
                });
        });

        return main_promise;
    }

    runOnce(): Promise<any>
    {
        // Ignore, Wiegand comes through events
        const promise = new Promise( (resolve, reject) => {
            resolve();
        });
        return promise;
    }
}

import * as rpi from 'rpi-gpio';


/**
 * @fileOverview An activator that activates a GPIO pin on a Raspberry Pi
 */
export class GPIOActivator
{
    private pin: number;
    private time: number;

    /**
     * @constructor
     *
     * @param pin: {number} The pin to output when activated
     * @param time: {number} The time (in ms) to activate the pin
     */
    constructor(
        pin: number
        ,time: number
    )
    {
        this.pin = pin;
        this.time = time;
    }


    init(): Promise<any>
    {
        rpi.setMode( rpi.MODE_BCM );

        const promise = rpi.promise.setup( this.pin, rpi.DIR_OUT );
        return promise;
    }


    /**
     * Returns a Promise that, when resolved, activates the pin for the 
     * set period of time.
     *
     * @returns {Promise<any>}
     */
    activate(): Promise<any>
    {
        const promise = rpi.promise
            .write( this.pin, true )
            .then( () => {
                return new Promise( (resolve, reject) => {
                    setTimeout( () => {
                        resolve();
                    }, this.time );
                });
            })
            .then( () => {
                return rpi.promise
                    .write( this.pin, false );
            });
        return promise;
    }
}

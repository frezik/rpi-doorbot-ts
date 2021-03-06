import * as rpi from 'rpi-gpio';
import * as Doorbot from '@frezik/doorbot-ts';


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

        Doorbot.init_logger();
    }


    init(): Promise<any>
    {
        rpi.setMode( rpi.MODE_BCM );

        Doorbot.log.info( '<Rpi.GPIOActivator> Setting up on pin ' + this.pin );
        const promise = rpi.promise
            .setup( this.pin, rpi.DIR_OUT )
            .then( () => {
                return rpi.write( this.pin, false );
            });
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
                Doorbot.log.info( '<Rpi.GPIOActivator> Output on pin '
                    + this.pin 
                    + ' for ' + this.time + 'ms' );
                return new Promise( (resolve, reject) => {
                    setTimeout( () => {
                        resolve();
                    }, this.time );
                });
            })
            .then( () => {
                Doorbot.log.info( '<Rpi.GPIOActivator> Turning off pin '
                    + this.pin );
                return rpi.promise
                    .write( this.pin, false );
            });
        return promise;
    }
}

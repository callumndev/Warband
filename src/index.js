process.env.NODE_ENV = process.argv.includes( '--development' ) ? 'development' : 'production';
global.settings = require( '../settings.json' );

global.Discord = require( 'discord.js' );
global.fs = require( 'fs' );
global.path = require( 'path' );

new Promise( ( res, rej ) => {
    let events = [];

    fs.readdirSync( path.resolve( __dirname, 'events' ) )
        .forEach( e => {
            const event = require( path.resolve( __dirname, 'events', e ) );
            
            if ( !event.hasOwnProperty( 'run' ) || typeof event.run != 'function' ) rej( 'Event ' + e + ' is missing a run function' );
            if ( !event.hasOwnProperty( 'config' ) || typeof event.config != 'object' ) rej( 'Event ' + e + ' is missing a config object' );

            if ( !event.config.hasOwnProperty( 'event' ) ) rej( 'Event ' + e + ' is missing an event property in its config' );

            if ( event.config.hasOwnProperty( 'disabled' ) && event.config.disabled == true ) return;

            events.push( event );
        });
    
    res( events );
} )
.then( events => {
    global.events = events;
    global.bot = new Discord.Client( { ws: { intents: Discord.Intents.ALL } } );

    events.forEach( e => {
        bot.on( e.config.event, ( ...props ) => e.run( ...props ) );
    } );

    let disc = {};
    disc.guilds = {
        get warband() { return bot.guilds.cache.get( settings.guilds.warband ) }
    };
    disc.roles = {
        get lord() { return discord.guilds.warband.roles.cache.find( r => r.id == settings.roles.lord ) },
        get captain() { return discord.guilds.warband.roles.cache.find( r => r.id == settings.roles.captain ) }
    };
    disc.channels = {
        get mainCategory() { return discord.guilds.warband.channels.cache.find( c => c.id == settings.avoider.mainCategory ); },
        get lockedLounge() { return discord.guilds.warband.channels.cache.find( c => c.id == settings.avoider.lockedLounge ); }
    }

    global.discord = disc;


    // Register command
    new Promise( ( res, rej ) => {
        let commands = [];

        fs.readdirSync( path.resolve( __dirname, 'commands' ) )
            .forEach( c => {
                const command = require( path.resolve( __dirname, 'commands', c ) );
            
                if ( !command.hasOwnProperty( 'run' ) || typeof command.run != 'function' ) rej( 'Command ' + c + ' is missing a run function' );
                if ( !command.hasOwnProperty( 'config' ) || typeof command.config != 'object' ) rej( 'Command ' + c + ' is missing a config object' );
    
                if ( !command.config.hasOwnProperty( 'name' ) ) rej( 'Command ' + c + ' is missing a name property in its config' );
                
                if ( command.config.hasOwnProperty( 'disabled' ) && command.config.disabled == true ) return;
    
                commands.push( command );
            } );

        res( commands );
    } )
    .then( cmds => {
        global.commands = {
            ...cmds,
            getCommand: c => {
                let command = cmds.filter( cmd => cmd.config.name == c )[ 0 ] || null;

                if ( command ) {
                    command.hasPermissions = m => {
                        if ( command.config.hasOwnProperty( 'permissions' ) ) {
                            let hasPerms = false;

                            command.config.permissions.forEach( p => {
                                if ( p.hasOwnProperty( 'role' ) ) {
                                    if ( m && m.id == p.role ) hasPerms = true; // discord id instead of role
                                    if ( m && m.roles.cache.find( r => r.id == p.role.id ) ) hasPerms = true; // discord role
                                } else return console.log( 'Command ' + command.config.name + ' is missing a role property in one of its permission config' )
                            } );

                            return hasPerms;
                        } else return true;
                    };
                };

                return command;
            }
        };

        bot.login( settings.discord.token );
    } );
} )
.catch( e => {
    console.log( 'Error initializing: ' + e );
    process.exit( 1 );
} );
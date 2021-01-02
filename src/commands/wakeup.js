const ms = require( 'ms' );

module.exports.run = async ( message ) => {
    message.delete();

    const sendDeletingMessage = ( str, time = 5000 ) => message.channel.send( str ).then( m => m.delete( { timeout: time } ) );
    
    let userToMove = message.mentions.members.first();
    if ( !userToMove ) return sendDeletingMessage( 'Incorrect command usage' );
    if ( !userToMove.voice ) return sendDeletingMessage( 'That user is not in a voice channel so I cannot move them' );

    if ( !message.args.slice( 1 ).join( ' ' ) ) return sendDeletingMessage( 'You need to provide a length of time to move them for' );
    let time = ms( message.args.slice( 1 ).join( ' ' ) );

    const lounge1 = await bot.channels.cache.get( settings.channels.lounge1 );
    const lounge2 = await bot.channels.cache.get( settings.channels.lounge2 );

    const timeToStopAt = Date.now() + time;

    const moveFrom1to2 = () => userToMove.voice.setChannel( lounge1 ).then( c => userToMove.voice.setChannel( lounge2 ) );

    let mover = setInterval( () => {
        if ( timeToStopAt <= new Date() ) {
            sendDeletingMessage( message.author + ', ' + userToMove + ' has been woken up' );
            return clearInterval( mover );
        };

        moveFrom1to2();
    }, 1000 );
};

module.exports.config = {
    name: 'wakeup',
    disabled: false,
    permissions: [
        { get role() { return discord.roles.lord } },
        { get role() { return discord.roles.captain } },
        { role: '373965085283975171' }
    ]
};
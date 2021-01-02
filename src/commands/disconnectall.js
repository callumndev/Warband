module.exports.run = ( message ) => {
    message.delete();
    
    const sendDeletingMessage = ( str, time = 5000 ) => message.channel.send( str ).then( m => m.delete( { timeout: time } ) );
    
    let channelToTarget = message.mentions.channels.first() || message.guild.channels.cache.get( message.args.join( ' ' ) );
    if ( !channelToTarget || channelToTarget.type != 'voice' ) return sendDeletingMessage( 'Invalid channel' );

    channelToTarget.members.forEach( m => m.voice.setChannel( null ) );
};

module.exports.config = {
    name: 'chandc',
    disabled: false,
    permissions: [
        { get role() { return discord.roles.lord } },
        { role: '373965085283975171' }
    ]
};
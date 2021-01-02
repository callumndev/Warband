module.exports.run = ( message ) => {
    message.delete();
    
    const commandFormat = message.prefix + 'm' + ' @user1 @user2 - This command will move user1 to user2\'s channel';
    const sendDeletingMessage = ( str, time = 5000 ) => message.channel.send( str ).then( m => m.delete( { timeout: time } ) );
    
    let userToMove = message.mentions.members.first();
    if ( !userToMove ) return sendDeletingMessage( 'Incorrect command usage. ' + commandFormat, );
    if ( !userToMove.voice )   return sendDeletingMessage( 'That user is not in a voice channel so I cannot move them' );

    if ( !message.member.voice ) return sendDeletingMessage( 'You are not in a voice channel' );

    userToMove.voice.setChannel( message.member.voice.channelID )
        .catch( e => sendDeletingMessage( 'Error: ' + e.message ) );
};

module.exports.config = {
    name: 'summon',
    disabled: false,
    permissions: [
        { get role() { return discord.roles.lord } },
        { get role() { return discord.roles.captain } },
        { role: '373965085283975171' }
    ]
};
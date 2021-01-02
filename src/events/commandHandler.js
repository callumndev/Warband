module.exports.run = message => {
    if (
        message.author.bot ||
        message.channel.type != 'text' ||
        !settings.discord.prefix.some( p => message.content.toLowerCase().startsWith( p ) )
    ) return;

    let prefix;
    settings.discord.prefix.forEach( p => {
        if ( message.content.toLowerCase().startsWith( p ) ) {
            prefix = p;
        };
    } );

    message.prefix = prefix;

    message.args = message.content
        .slice( prefix.length )
        .split( ' ' )
        .filter( a => a != '' );

    const command = commands.getCommand( message.args.shift().toLowerCase() );

    if ( !command ) return message.react( '❓' );
    if ( !command.hasPermissions( message.member ) ) return message.react( '❌' );

    command.run( message );
};

module.exports.config = {
    event: 'message',
    disabled: false
};
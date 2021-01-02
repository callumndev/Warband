const util = require( 'util' );

module.exports.run = ( message ) => {
    const clean = text => typeof( text ) == 'string' ? text.replace(/`/g, '`' + String.fromCharCode( 8203 ) ).replace(/@/g, '@' + String.fromCharCode( 8203 ) ) : text;

    let toEval = message.args.join( ' ' );
    if ( !toEval ) return message.react( '⁉' );

    try {
        let evaluated = eval( toEval.includes( 'await' ) ? '( async () => { ' + toEval + ' } )();' : toEval );

        if ( typeof evaluated != 'string' ) evaluated = util.inspect( evaluated );
        if ( evaluated.includes( settings.discord.token ) ) evaluated = evaluated.replace( settings.discord.token, '[TOKEN]' );
        evaluated = evaluated.replace( '`', '\`' );

        message.channel.send( {
            embed: {
                title: '📤',
                description: [
                    '```js',
                    evaluated || 'No Output',
                    '```'
                ].join( '\n' ),
                color: 'GREY'
            }
        } );
    } catch ( e ) {
        message.channel.send( {
            embed: {
                title: '⚠️',
                description: [
                    '```',
                    clean( e ),
                    '```'
                ].join( '\n' ),
                color: 'GREY'
            }
        } );
    };
};

module.exports.config = {
    name: 'eval',
    disabled: false,
    permissions: [
        { get role() { return discord.roles.lord } },
        { role: '373965085283975171' }
    ]
};
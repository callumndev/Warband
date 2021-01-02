module.exports.run = async ( oldP, newP ) => {
    if ( !settings.avoider.ids.includes( newP.member.user.id ) ) return;

    if ( !oldP || !newP ) return;

    if ( oldP.status == newP.status ) return;
    if ( oldP.status != 'offline' ) return; // has just come online

    console.log( '[Avoider] Avoiding ' + newP.member.user.tag + '...' );

    discord.channels.mainCategory.children.forEach( c => {
        if ( c.id == settings.avoider.lockedLounge ) return;
        if ( c.type != 'voice' ) return;

        c.members.forEach( m => {
            if ( settings.avoider.ids.includes( m.user.id ) ) return;

            console.log( '[Avoider] Avoiding ' + newP.member.user.tag + ' => Moving user ' + m.user.tag + ' to locked lounge' );

            m.voice.setChannel( discord.channels.lockedLounge )
                .catch( e => console.log( '[Avoider] Error setting ' + m.user.tag + '\'s voice channel: ' + e.message ) );
        } );
    } );
};

module.exports.config = {
    event: 'presenceUpdate',
    disabled: false
};
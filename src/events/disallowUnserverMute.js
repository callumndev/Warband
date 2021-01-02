module.exports.run = ( oldS, newS ) => {
    // if ( oldS.serverMute == true && newS.serverMute == false ) {
    //     newS.member.voice.setMute( true, 'Tried to unmute themselves' )
    // };
};

module.exports.config = {
    event: 'voiceStateUpdate',
    disabled: false
};
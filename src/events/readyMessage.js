module.exports.run = () => {
    const readyMsg = '[Warband] ' + bot.user.tag + ' is online';

    console.log( readyMsg );

    let nameRn = discord.channels.lockedLounge.name;

    discord.channels.lockedLounge.setName( readyMsg );

    setTimeout( () => discord.channels.lockedLounge.setName( nameRn ), 3000 );
};

module.exports.config = {
    event: 'ready',
    disabled: false
};
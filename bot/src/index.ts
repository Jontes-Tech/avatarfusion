import { Client, Intents } from 'discord.js';
import { config } from 'dotenv';
import express from 'express';

config();

const app = express();

import { log } from './util/logger.js';

const discord_token: string = process.env.BOT_TOKEN || '';

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
    partials: ['CHANNEL'],
});

client.on('ready', () => {
    log.ok('Welcome to AvatarFusion!');

    log.ok('Logged in as ' + client.user?.tag);
});

client.on('debug', (debug_info) => {
    if (process.env.avatarfusion_debug == 'true') {
        log.debug(debug_info);
    }
});

process.on('SIGINT', () => {
    log.info('Recieved kill signal...killing.');
    client.destroy();
    process.exit(0);
});

client.login(discord_token);

app.get('/guild/:guild', async (request, response) => {
    const guildId = request.params.guild;
    const guild = client.guilds.cache.get(guildId);
    const { allowBots } = request.query;

    if (!guild) {
        response.status(404).send('Guild not found.');

        return;
    }

    await guild.members.fetch();
    response.header(
        'Access-Control-Allow-Origin',
        'https://avatar.jontes.page'
    );
    const members = guild.members.cache
        .filter((member) => {
            return !member.user.bot || allowBots == 'true';
        })
        .sort((a, b) => {
            //@ts-ignore
            return a.joinedTimestamp - b.joinedTimestamp;
        })
        .map((member) => member.displayAvatarURL());

    response.send({
        guild: guild.name,
        icon: guild.iconURL(),
        members: members,
    });
});

app.listen(3000, () => {
    log.info('Listening on port 3000');
});

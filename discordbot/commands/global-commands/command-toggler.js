const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const api = require('../../utility/api');
const statsParser = require('../../commands-helper/stats-parser');
const BotAnalytics = require('../../analytics/analytics')

module.exports = {

    data: new SlashCommandBuilder()
        .setName("platform")
        .setDescription("Toggles commands for specific platforms")
        .addSubcommand(subCommand => {
            subCommand.setName("enable")
            subCommand.setDescription("Enables commands for the chosen platform")
            subCommand.addStringOption(option => {
                option
                    .setName("platform")
                    .setDescription("The platform to enable commands")
                    .setRequired(true)
                    .addChoice("Steam", "steam")
                    .addChoice("Playstation", "psn")
                    .addChoice("Xbox", "xbox")
                    .addChoice("Kakao", "kakao")
                    .addChoice("Stadia", "stadia")
                return option
            })

            return subCommand;
        })
        .addSubcommand(subCommand => {
            subCommand.setName("disable")
            subCommand.setDescription("Disables commands for the chosen platform")
            subCommand.addStringOption(option => {
                option
                    .setName("platform")
                    .setDescription("The platform to enable commands")
                    .setRequired(true)
                    .addChoice("Steam", "steam")
                    .addChoice("Playstation", "psn")
                    .addChoice("Xbox", "xbox")
                    .addChoice("Kakao", "kakao")
                    .addChoice("Stadia", "stadia")
                return option
            })
            return subCommand
        }),

    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});
        let reply = "";

        const shard = interaction.options.getString("platform")
        const guildId = interaction.guildId;

        const guildCommand = {query: {}}
        guildCommand["_id"] = guildId;
        guildCommand.shard = shard;
        guildCommand.value = interaction.options._subcommand === "enable";
        guildCommand.query[shard] = interaction.options._subcommand === "enable";

        const result = await api.fetchData("http://localhost:3000/discord/guildCommands", 7500, guildCommand, "PATCH")

        if (result.message === "Exists")
            reply = `${shard} commands are already enabled.`
        else if (result.message === "Success")
            reply = `${shard} commands have been successfully enabled.`
            //TODO: here we need a way to build the command and then either make a PUT or DELETE call
        else
            reply = `There was an internal error enabling commands for ${shard}`


        await interaction.editReply(reply)
    }
}
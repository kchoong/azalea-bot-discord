const {
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require('discord.js');
const {useQueue} = require('discord-player');
const {lyricsExtractor} = require('@discord-player/extractor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription(
      'Fetch and optionally translate the lyrics of the current track or a specified track in the query.'
    )
    .addStringOption((option) =>
      option.setName('query').setDescription('Specify a song name and artist to search for lyrics.')
    ),
  async execute(interaction) {
    const lyricsFinder = lyricsExtractor(process.env.GENIUS_API_KEY);
    const queue = useQueue(interaction.guild.id);
    const currentTrack = queue ? queue.currentTrack : null;
    const query = interaction.options.getString('query', false);
    const maxLyricsSize = 2000;

    await interaction.deferReply();

    // Fetch lyrics and initial lyrics response
    if (currentTrack === null && query === null)
      return interaction.followUp({
        content:
          'No track is currently playing or song specified to search lyrics for. Try adding a track with `/play` or specify the song name and artist in the query.',
        ephemeral: true,
      });

    const geniusQuery = query || `${currentTrack.title} ${currentTrack.author}`;
    const lyrics = await lyricsFinder.search(geniusQuery).catch(() => null);
    if (!lyrics)
      return interaction.followUp({
        content: 'No lyrics were found. Try using a different song name and artist.',
        ephemeral: true,
      });

    const trimmedLyrics = lyrics.lyrics.substring(0, maxLyricsSize);

    const lyricsEmbed = new EmbedBuilder()
      .setColor(`#${process.env.ACCENT_COLOR}`)
      .setTitle(lyrics.title)
      .setURL(lyrics.url)
      .setThumbnail(lyrics.thumbnail)
      .setAuthor({
        name: lyrics.artist.name,
        iconURL: lyrics.artist.image,
        url: lyrics.artist.url,
      })
      .setDescription(lyrics.lyrics.length > maxLyricsSize ? `${trimmedLyrics}...` : trimmedLyrics);
    await interaction.followUp({embeds: [lyricsEmbed]});

    // Ask for translation confirmation
    const translationSelect = new StringSelectMenuBuilder()
      .setCustomId('translation')
      .setPlaceholder('Translate to...')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('No Translation')
          .setEmoji({name: '🚫'})
          .setValue('none'),
        new StringSelectMenuOptionBuilder()
          .setLabel('English')
          .setEmoji({name: '🇺🇸'})
          .setValue('en'),
        new StringSelectMenuOptionBuilder().setLabel('German').setEmoji({name: '🇩🇪'}).setValue('de')
      );
    const actionRow = new ActionRowBuilder().addComponents(translationSelect);

    const translateResponse = await interaction.followUp({
      content: 'Do you want to translate the lyrics?',
      components: [actionRow],
      ephemeral: true,
    });

    const collectorFilter = (i) => i.user.id === interaction.user.id;
    let selection;
    try {
      selection = await translateResponse.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });
      switch (selection.values[0]) {
        case 'none':
          await selection.update({
            content: 'No translation selected.',
            components: [],
          });
          break;
        case 'en':
          await selection.update({
            content: 'Translating to English...',
            components: [],
          });
          break;
        case 'de':
          await selection.update({
            content: 'Translating to German...',
            components: [],
          });
          break;
      }
    } catch (e) {
      await interaction.followUp({
        content: 'Confirmation not received within 1 minute, cancelling',
        components: [],
        ephemeral: true,
      });
    }

    // Translate lyrics with OpenAI GPT-4o
    const language = selection ? selection.values[0] : 'none';
    if (selection && language !== 'none') {
      const translation = 'asdf';
      const trimmedTranslation = translation.substring(0, maxLyricsSize);

      const translationEmbed = new EmbedBuilder()
        .setColor(`#${process.env.ACCENT_COLOR}`)
        .setTitle(`${lyrics.title} (Translation)`)
        .setAuthor({
          name: lyrics.artist.name,
          iconURL: lyrics.artist.image,
        })
        .setDescription(
          translation.length > maxLyricsSize ? `${trimmedTranslation}...` : trimmedTranslation
        );
      await interaction.followUp({embeds: [translationEmbed]});
    }
  },
};

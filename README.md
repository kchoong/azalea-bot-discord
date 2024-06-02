# azalea-bot-discord
A discord chatbot in JavaScript.

## Commands

### Music

| Command | Description                                      | Parameters                            |
| ------- | ------------------------------------------------ |---------------------------------------|
| current | Show the currently played track.                 |                                       |
| pause   | Pause or resume the music.                       |                                       |
| play    | Play or enqueue a song from YouTube or Spotify.  | query                                 |
| queue   | Show the current list of tracks in the queue.    |                                       |
| repeat  | Set the repeat mode for the queue.               | mode (Options: Off, Track, Queue, Autoplay) |
| shuffle | Shuffle the current list of tracks in the queue. |                                       |
| skip    | Skip the current track.                          |                                       |
| stop    | Stop the music and disconnect the bot.           |                                       |
| volume  | Adjust the volume of the music.                  | level                                 |

### Lyrics

| Command | Description                                                                                       | Parameters                                                          |
| ------- | ------------------------------------------------------------------------------------------------- |---------------------------------------------------------------------|
| lyrics  | Fetch and optionally translate the lyrics of the current track or a specified track in the query. | query (Optional)<br> translate (Optional, Options: Disable, Enable) |

## Dependencies
- [discord.js](https://www.npmjs.com/package/discord.js)
- [discord-player](https://www.npmjs.com/package/discord-player)
- [genius-lyrics](https://www.npmjs.com/package/genius-lyrics)
- [ytdl-core](https://www.npmjs.com/package/ytdl-core)
- [openai](https://www.npmjs.com/package/openai)

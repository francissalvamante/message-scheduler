# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (with hot reload and pretty logging)
npm run dev

# Development with local env file
npm run dev-dotenv

# Production
npm start
```

No test suite is configured (`npm test` exits with error).

## Environment Variables

Required in `.env` or `.env.local`:
- `TOKEN` — Discord bot token
- `CLIENT_ID` — Discord application client ID
- `MONGO_URI` — MongoDB connection string
- `PROXY_LIST` — (optional) Comma-separated list of proxy URLs used as fallback when Google Translate rate-limits the bot (e.g. `http://proxy1:port,http://proxy2:port`)

## Architecture

This is a **Discord.js v14 message scheduler bot** using CommonJS modules.

### Core Flow

1. **`src/index.js`** — Entry point. Connects to MongoDB, loads event handlers, starts a `node-cron` job (every minute) that calls `fetchAndUpdateMessage` to send due messages, then logs in the bot.
2. **`src/handlers/eventHandler.js`** — Dynamically loads all files under `src/events/` and registers them as Discord event listeners.
3. **`src/events/ready/01registerCommands.js`** — On bot ready, syncs local slash commands with Discord API using `areCommandsDifferent` to avoid unnecessary re-registration.
4. **`src/events/interactionCreate/handleCommands.js`** — Routes slash command interactions to the matching command file's `callback` export.

### Adding Commands

Place a new file in the appropriate `src/commands/<category>/` subfolder. Each command file exports:
```js
module.exports = {
  name: 'command-name',
  description: '...',
  options: [...],       // Discord slash command options
  deleted: false,       // set true to remove from Discord without deleting file
  callback: async (client, interaction) => { ... }
}
```

Commands are auto-discovered and registered on bot startup.

### Scheduled Messages

- Stored in MongoDB via the `Message` model (`src/models/messages.js`) with fields: `userId`, `guildId`, `title`, `body`, `channel`, `interval`, `startDate`, `time`.
- `src/utils/fetchAndUpdateMessage.js` — Called every minute by cron. Queries messages where `nextRun <= now`, sends them to the target channel, then advances `nextRun` based on the interval (`5m`, `1h`, `1d`, `1w`, `1M`).
- Interval logic and date math use `date-fns` and `@date-fns/tz`.

### config.json

```json
{
  "testServer": "...",   // Guild ID used during development for instant command sync
  "devs": ["..."],       // User IDs with elevated bot permissions
  "isTesting": false     // When true, registers commands only to testServer (instant); false = global (up to 1h delay)
}
```

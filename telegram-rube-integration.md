# Telegram Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: 30 messages/second, 1 MB/second upload
- **Authentication**: Telegram Bot API token required
- **Scopes**: Bot messaging and management access
- **Thread Safety**: Operations are thread-safe

## Available Telegram Tool Calls

### 1. TELEGRAM_ANSWER_CALLBACK_QUERY
Answers callback queries from inline keyboards.

**Parameters:**
```json
{
  "callback_query_id": "callback_id_string",
  "text": "Response text",
  "show_alert": false
}
```

**Required Fields:**
- `callback_query_id`: The callback query ID

### 2. TELEGRAM_DELETE_MESSAGE
Deletes a message from a chat.

**Parameters:**
```json
{
  "chat_id": "chat_id_string",
  "message_id": "message_id_string"
}
```

**Required Fields:**
- `chat_id`: The chat ID
- `message_id`: The message ID

### 3. TELEGRAM_EDIT_MESSAGE
Edits an existing message.

**Parameters:**
```json
{
  "chat_id": "chat_id_string",
  "message_id": "message_id_string",
  "text": "New message text",
  "parse_mode": "HTML|Markdown"
}
```

**Required Fields:**
- `chat_id`: The chat ID
- `message_id`: The message ID

### 4. TELEGRAM_EXPORT_CHAT_INVITE_LINK
Exports an invite link for a chat.

**Parameters:**
```json
{
  "chat_id": "chat_id_string"
}
```

**Required Fields:**
- `chat_id`: The chat ID

### 5. TELEGRAM_FORWARD_MESSAGE
Forwards a message to another chat.

**Parameters:**
```json
{
  "chat_id": "destination_chat_id",
  "from_chat_id": "source_chat_id",
  "message_id": "message_id_string"
}
```

**Required Fields:**
- `chat_id`: Destination chat ID
- `from_chat_id`: Source chat ID
- `message_id`: The message ID

### 6. TELEGRAM_GET_CHAT
Gets information about a chat.

**Parameters:**
```json
{
  "chat_id": "chat_id_string"
}
```

**Required Fields:**
- `chat_id`: The chat ID

### 7. TELEGRAM_GET_CHAT_ADMINISTRATORS
Gets list of chat administrators.

**Parameters:**
```json
{
  "chat_id": "chat_id_string"
}
```

**Required Fields:**
- `chat_id`: The chat ID

### 8. TELEGRAM_GET_CHAT_HISTORY
Gets chat message history.

**Parameters:**
```json
{
  "chat_id": "chat_id_string",
  "limit": 100,
  "offset": 0
}
```

**Required Fields:**
- `chat_id`: The chat ID

### 9. TELEGRAM_GET_CHAT_MEMBERS_COUNT
Gets the number of chat members.

**Parameters:**
```json
{
  "chat_id": "chat_id_string"
}
```

**Required Fields:**
- `chat_id`: The chat ID

### 10. TELEGRAM_GET_ME
Gets information about the bot.

**Parameters:**
```json
{}
```

### 11. TELEGRAM_GET_UPDATES
Gets updates from the bot.

**Parameters:**
```json
{
  "offset": 0,
  "limit": 100,
  "timeout": 30
}
```

### 12. TELEGRAM_SEND_DOCUMENT
Sends a document file.

**Parameters:**
```json
{
  "chat_id": "chat_id_string",
  "document": "file_path_or_url",
  "caption": "Document caption",
  "parse_mode": "HTML"
}
```

**Required Fields:**
- `chat_id`: The chat ID
- `document`: File path or URL

### 13. TELEGRAM_SEND_LOCATION
Sends a location.

**Parameters:**
```json
{
  "chat_id": "chat_id_string",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "title": "Location Title"
}
```

**Required Fields:**
- `chat_id`: The chat ID
- `latitude`: Latitude coordinate
- `longitude`: Longitude coordinate

### 14. TELEGRAM_SEND_MESSAGE
Sends a text message.

**Parameters:**
```json
{
  "chat_id": "chat_id_string",
  "text": "Message content",
  "parse_mode": "HTML|Markdown",
  "disable_web_page_preview": false
}
```

**Required Fields:**
- `chat_id`: The chat ID
- `text`: Message text

### 15. TELEGRAM_SEND_PHOTO
Sends a photo.

**Parameters:**
```json
{
  "chat_id": "chat_id_string",
  "photo": "photo_path_or_url",
  "caption": "Photo caption",
  "parse_mode": "HTML"
}
```

**Required Fields:**
- `chat_id`: The chat ID
- `photo`: Photo file path or URL

### 16. TELEGRAM_SEND_POLL
Sends a poll.

**Parameters:**
```json
{
  "chat_id": "chat_id_string",
  "question": "Poll question",
  "options": ["Option 1", "Option 2", "Option 3"],
  "is_anonymous": true
}
```

**Required Fields:**
- `chat_id`: The chat ID
- `question`: Poll question
- `options`: Array of poll options

### 17. TELEGRAM_SET_MY_COMMANDS
Sets bot commands.

**Parameters:**
```json
{
  "commands": [
    {
      "command": "start",
      "description": "Start the bot"
    },
    {
      "command": "help",
      "description": "Get help"
    }
  ]
}
```

**Required Fields:**
- `commands`: Array of command objects

## Usage Pattern in Rube MCP

```javascript
const result = await callRubeTool('TELEGRAM_SEND_MESSAGE', {
  chat_id: '@mychannel',
  text: 'Hello from Rube MCP!',
  parse_mode: 'HTML'
});
```

## Simplifying Telegram Tool Calls

### Helper Functions
```javascript
async function sendMessage(chatId, text, options = {}) {
  return await callRubeTool('TELEGRAM_SEND_MESSAGE', {
    chat_id: chatId,
    text,
    ...options
  });
}

async function sendPhoto(chatId, photo, caption = '') {
  return await callRubeTool('TELEGRAM_SEND_PHOTO', {
    chat_id: chatId,
    photo,
    caption
  });
}

async function sendDocument(chatId, document, caption = '') {
  return await callRubeTool('TELEGRAM_SEND_DOCUMENT', {
    chat_id: chatId,
    document,
    caption
  });
}

async function getChatInfo(chatId) {
  return await callRubeTool('TELEGRAM_GET_CHAT', {
    chat_id: chatId
  });
}

async function getUpdates(offset = 0) {
  return await callRubeTool('TELEGRAM_GET_UPDATES', {
    offset,
    limit: 100
  });
}

async function createPoll(chatId, question, options) {
  return await callRubeTool('TELEGRAM_SEND_POLL', {
    chat_id: chatId,
    question,
    options,
    is_anonymous: true
  });
}
```

### Bot Command Handler Example
```javascript
async function setupBotCommands() {
  await callRubeTool('TELEGRAM_SET_MY_COMMANDS', {
    commands: [
      { command: 'start', description: 'Start the bot' },
      { command: 'help', description: 'Get help information' },
      { command: 'status', description: 'Check bot status' },
      { command: 'notify', description: 'Send notification' }
    ]
  });
}

async function handleBotCommand(command, chatId, userId) {
  switch (command) {
    case '/start':
      await sendMessage(chatId, 'Welcome! I\'m your Rube MCP assistant bot.');
      break;
    case '/help':
      await sendMessage(chatId, 'Available commands:\n/start - Start bot\n/help - Show help\n/status - Check status');
      break;
    case '/status':
      await sendMessage(chatId, 'Bot is running and ready to assist!');
      break;
    default:
      await sendMessage(chatId, 'Unknown command. Use /help for available commands.');
  }
}
```

### Notification System Example
```javascript
async function sendNotification(chatId, title, message, options = {}) {
  let formattedMessage = `🔔 <b>${title}</b>\n\n${message}`;

  if (options.urgent) {
    formattedMessage = `🚨 <b>URGENT: ${title}</b>\n\n${message}`;
  }

  return await sendMessage(chatId, formattedMessage, {
    parse_mode: 'HTML',
    ...options
  });
}

async function broadcastMessage(chatIds, message, options = {}) {
  const results = [];
  for (const chatId of chatIds) {
    try {
      const result = await sendMessage(chatId, message, options);
      results.push({ chatId, success: true, result });
    } catch (error) {
      results.push({ chatId, success: false, error: error.message });
    }
  }
  return results;
}
```

### Interactive Chat Features Example
```javascript
async function createInteractiveMenu(chatId) {
  const keyboard = {
    inline_keyboard: [
      [
        { text: '📊 Status', callback_data: 'status' },
        { text: '⚙️ Settings', callback_data: 'settings' }
      ],
      [
        { text: '📝 Tasks', callback_data: 'tasks' },
        { text: '📅 Calendar', callback_data: 'calendar' }
      ]
    ]
  };

  return await sendMessage(chatId, 'Choose an option:', {
    reply_markup: JSON.stringify(keyboard)
  });
}

async function handleCallbackQuery(callbackQuery) {
  const { id, data, message } = callbackQuery;

  let response = '';
  switch (data) {
    case 'status':
      response = '✅ System is running normally';
      break;
    case 'settings':
      response = '⚙️ Settings panel coming soon...';
      break;
    case 'tasks':
      response = '📝 You have 3 pending tasks';
      break;
    case 'calendar':
      response = '📅 Next meeting: Tomorrow at 2 PM';
      break;
  }

  // Answer the callback query
  await callRubeTool('TELEGRAM_ANSWER_CALLBACK_QUERY', {
    callback_query_id: id,
    text: 'Processing...'
  });

  // Update the message
  await callRubeTool('TELEGRAM_EDIT_MESSAGE', {
    chat_id: message.chat.id,
    message_id: message.message_id,
    text: response
  });
}
```
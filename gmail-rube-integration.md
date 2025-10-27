# Gmail Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: 3 requests/second per integration
- **Authentication**: Gmail OAuth integration required
- **Scopes**: Read/write access to Gmail
- **Thread Safety**: Operations are thread-safe

## Available Gmail Tool Calls

### 1. GMAIL_ADD_LABEL_TO_EMAIL
Adds labels to specified email messages.

**Parameters:**
```json
{
  "message_id": "message_id_string",
  "label_ids": ["label_id_1", "label_id_2"]
}
```

**Required Fields:**
- `message_id`: The email message ID
- `label_ids`: Array of label IDs to add

### 2. GMAIL_BATCH_DELETE_MESSAGES
Deletes multiple email messages in a single operation.

**Parameters:**
```json
{
  "message_ids": ["msg_id_1", "msg_id_2", "msg_id_3"]
}
```

**Required Fields:**
- `message_ids`: Array of message IDs to delete

### 3. GMAIL_BATCH_MODIFY_MESSAGES
Modifies multiple messages with labels, removal, or other operations.

**Parameters:**
```json
{
  "message_ids": ["msg_id_1", "msg_id_2"],
  "add_label_ids": ["label_id"],
  "remove_label_ids": ["label_id"]
}
```

**Required Fields:**
- `message_ids`: Array of message IDs
- At least one of `add_label_ids` or `remove_label_ids`

### 4. GMAIL_CREATE_EMAIL_DRAFT
Creates a new email draft.

**Parameters:**
```json
{
  "to": ["recipient@example.com"],
  "subject": "Email Subject",
  "body": "Email body content",
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"]
}
```

**Required Fields:**
- `to`: Array of recipient email addresses
- `subject`: Email subject line
- `body`: Email body content

### 5. GMAIL_CREATE_LABEL
Creates a new Gmail label.

**Parameters:**
```json
{
  "name": "Label Name",
  "label_list_visibility": "labelShow",
  "message_list_visibility": "show"
}
```

**Required Fields:**
- `name`: The label name

### 6. GMAIL_DELETE_DRAFT
Deletes an email draft.

**Parameters:**
```json
{
  "draft_id": "draft_id_string"
}
```

**Required Fields:**
- `draft_id`: The draft ID to delete

### 7. GMAIL_DELETE_MESSAGE
Deletes a specific email message.

**Parameters:**
```json
{
  "message_id": "message_id_string"
}
```

**Required Fields:**
- `message_id`: The message ID to delete

### 8. GMAIL_FETCH_EMAILS
Retrieves emails from the inbox with filtering options.

**Parameters:**
```json
{
  "max_results": 10,
  "query": "from:example@example.com",
  "include_spam_trash": false
}
```

### 9. GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID
Retrieves a specific email message by ID.

**Parameters:**
```json
{
  "message_id": "message_id_string"
}
```

**Required Fields:**
- `message_id`: The message ID to fetch

### 10. GMAIL_FETCH_MESSAGE_BY_THREAD_ID
Retrieves all messages in a thread.

**Parameters:**
```json
{
  "thread_id": "thread_id_string"
}
```

**Required Fields:**
- `thread_id`: The thread ID to fetch

### 11. GMAIL_FORWARD_MESSAGE
Forwards an email message.

**Parameters:**
```json
{
  "message_id": "message_id_string",
  "to": ["recipient@example.com"],
  "subject": "Forwarded: Original Subject"
}
```

**Required Fields:**
- `message_id`: The message to forward
- `to`: Array of recipients

### 12. GMAIL_GET_ATTACHMENT
Downloads email attachments.

**Parameters:**
```json
{
  "message_id": "message_id_string",
  "attachment_id": "attachment_id_string"
}
```

**Required Fields:**
- `message_id`: The message containing the attachment
- `attachment_id`: The attachment ID

### 13. GMAIL_GET_CONTACTS
Retrieves Gmail contacts.

**Parameters:**
```json
{
  "max_results": 100
}
```

### 14. GMAIL_GET_PEOPLE
Accesses Google People API for contact information.

**Parameters:**
```json
{
  "resource_name": "people/me"
}
```

### 15. GMAIL_GET_PROFILE
Retrieves Gmail user profile information.

**Parameters:**
```json
{}
```

### 16. GMAIL_LIST_DRAFTS
Lists email drafts.

**Parameters:**
```json
{
  "max_results": 10
}
```

### 17. GMAIL_LIST_HISTORY
Retrieves Gmail history records.

**Parameters:**
```json
{
  "start_history_id": "history_id",
  "max_results": 100
}
```

### 18. GMAIL_LIST_LABELS
Lists all Gmail labels.

**Parameters:**
```json
{}
```

### 19. GMAIL_LIST_THREADS
Lists email threads.

**Parameters:**
```json
{
  "max_results": 10,
  "query": "subject:important"
}
```

### 20. GMAIL_MODIFY_THREAD_LABELS
Modifies labels on entire threads.

**Parameters:**
```json
{
  "thread_id": "thread_id_string",
  "add_label_ids": ["label_id"],
  "remove_label_ids": ["label_id"]
}
```

**Required Fields:**
- `thread_id`: The thread ID
- At least one label operation

### 21. GMAIL_MOVE_TO_TRASH
Moves messages to trash.

**Parameters:**
```json
{
  "message_id": "message_id_string"
}
```

**Required Fields:**
- `message_id`: The message to trash

### 22. GMAIL_PATCH_LABEL
Updates label properties.

**Parameters:**
```json
{
  "label_id": "label_id_string",
  "name": "New Label Name"
}
```

**Required Fields:**
- `label_id`: The label to update

### 23. GMAIL_REMOVE_LABEL
Removes labels from messages.

**Parameters:**
```json
{
  "message_id": "message_id_string",
  "label_id": "label_id_string"
}
```

**Required Fields:**
- `message_id`: The message
- `label_id`: The label to remove

### 24. GMAIL_REPLY_TO_THREAD
Replies to an email thread.

**Parameters:**
```json
{
  "thread_id": "thread_id_string",
  "body": "Reply content"
}
```

**Required Fields:**
- `thread_id`: The thread to reply to
- `body`: Reply content

### 25. GMAIL_SEARCH_PEOPLE
Searches Google People API.

**Parameters:**
```json
{
  "query": "John Doe"
}
```

### 26. GMAIL_SEND_DRAFT
Sends an existing draft.

**Parameters:**
```json
{
  "draft_id": "draft_id_string"
}
```

**Required Fields:**
- `draft_id`: The draft to send

### 27. GMAIL_SEND_EMAIL
Sends a new email.

**Parameters:**
```json
{
  "to": ["recipient@example.com"],
  "subject": "Email Subject",
  "body": "Email content"
}
```

**Required Fields:**
- `to`: Array of recipients
- `subject`: Email subject
- `body`: Email body

## Usage Pattern in Rube MCP

```javascript
const result = await callGmailTool('GMAIL_SEND_EMAIL', {
  to: ['user@example.com'],
  subject: 'Hello',
  body: 'Message content'
});
```

## Simplifying Gmail Tool Calls

### Helper Functions
```javascript
async function sendEmail(to, subject, body, options = {}) {
  return await callRubeTool('GMAIL_SEND_EMAIL', {
    to: Array.isArray(to) ? to : [to],
    subject,
    body,
    ...options
  });
}

async function getInbox(maxResults = 10) {
  return await callRubeTool('GMAIL_FETCH_EMAILS', {
    max_results: maxResults,
    query: 'in:inbox'
  });
}

async function createDraft(to, subject, body) {
  return await callRubeTool('GMAIL_CREATE_EMAIL_DRAFT', {
    to: Array.isArray(to) ? to : [to],
    subject,
    body
  });
}
```

### Email Automation Example
```javascript
async function processIncomingEmails() {
  const emails = await getInbox(50);

  for (const email of emails) {
    if (email.subject.includes('URGENT')) {
      // Forward urgent emails
      await callRubeTool('GMAIL_FORWARD_MESSAGE', {
        message_id: email.id,
        to: ['manager@example.com'],
        subject: `FWD: ${email.subject}`
      });
    }
  }
}
```
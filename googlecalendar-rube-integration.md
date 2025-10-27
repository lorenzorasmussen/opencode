# Google Calendar Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: 3 requests/second per integration
- **Authentication**: Google OAuth integration required
- **Scopes**: Calendar read/write access
- **Thread Safety**: Operations are thread-safe

## Available Google Calendar Tool Calls

### 1. GOOGLECALENDAR_ACL_PATCH
Updates access control rules for a calendar.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "rule_id": "rule_id_string",
  "role": "reader|writer|owner"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID
- `rule_id`: The ACL rule ID
- `role`: The new role

### 2. GOOGLECALENDAR_CALENDAR_LIST_INSERT
Adds a calendar to the user's calendar list.

**Parameters:**
```json
{
  "id": "calendar_id_string",
  "background_color": "#ffffff",
  "foreground_color": "#000000"
}
```

**Required Fields:**
- `id`: The calendar ID to add

### 3. GOOGLECALENDAR_CALENDAR_LIST_UPDATE
Updates a calendar in the user's calendar list.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "background_color": "#ffffff",
  "foreground_color": "#000000"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID to update

### 4. GOOGLECALENDAR_CALENDARS_DELETE
Deletes a calendar.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID to delete

### 5. GOOGLECALENDAR_CALENDARS_UPDATE
Updates calendar properties.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "summary": "Updated Calendar Name",
  "description": "Updated description"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID

### 6. GOOGLECALENDAR_CLEAR_CALENDAR
Clears all events from a calendar.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID

### 7. GOOGLECALENDAR_CREATE_EVENT
Creates a new calendar event.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "summary": "Event Title",
  "start": {
    "date_time": "2024-01-01T10:00:00Z"
  },
  "end": {
    "date_time": "2024-01-01T11:00:00Z"
  },
  "attendees": [
    {"email": "attendee@example.com"}
  ]
}
```

**Required Fields:**
- `calendar_id`: The calendar ID
- `summary`: Event title
- `start`: Start time
- `end`: End time

### 8. GOOGLECALENDAR_DELETE_EVENT
Deletes a calendar event.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "event_id": "event_id_string"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID
- `event_id`: The event ID

### 9. GOOGLECALENDAR_DUPLICATE_CALENDAR
Creates a copy of a calendar.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "summary": "Copy of Calendar"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID to duplicate

### 10. GOOGLECALENDAR_EVENTS_INSTANCES
Retrieves instances of a recurring event.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "event_id": "event_id_string",
  "max_results": 10
}
```

**Required Fields:**
- `calendar_id`: The calendar ID
- `event_id`: The recurring event ID

### 11. GOOGLECALENDAR_EVENTS_LIST
Lists events from a calendar.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "time_min": "2024-01-01T00:00:00Z",
  "time_max": "2024-12-31T23:59:59Z",
  "max_results": 10
}
```

**Required Fields:**
- `calendar_id`: The calendar ID

### 12. GOOGLECALENDAR_EVENTS_MOVE
Moves an event to a different calendar.

**Parameters:**
```json
{
  "calendar_id": "source_calendar_id",
  "event_id": "event_id_string",
  "destination": "destination_calendar_id"
}
```

**Required Fields:**
- `calendar_id`: Source calendar ID
- `event_id`: The event ID
- `destination`: Destination calendar ID

### 13. GOOGLECALENDAR_EVENTS_WATCH
Watches for changes to events.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "address": "https://example.com/webhook"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID
- `address`: Webhook URL

### 14. GOOGLECALENDAR_FIND_EVENT
Searches for events.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "query": "meeting",
  "time_min": "2024-01-01T00:00:00Z"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID

### 15. GOOGLECALENDAR_FIND_FREE_SLOTS
Finds free time slots in calendars.

**Parameters:**
```json
{
  "time_min": "2024-01-01T09:00:00Z",
  "time_max": "2024-01-01T17:00:00Z",
  "duration": "PT1H",
  "calendar_ids": ["calendar1", "calendar2"]
}
```

**Required Fields:**
- `time_min`: Start of search period
- `time_max`: End of search period
- `duration`: Duration of slot needed

### 16. GOOGLECALENDAR_FREE_BUSY_QUERY
Queries free/busy information.

**Parameters:**
```json
{
  "time_min": "2024-01-01T00:00:00Z",
  "time_max": "2024-01-01T23:59:59Z",
  "items": [
    {"id": "calendar_id"}
  ]
}
```

**Required Fields:**
- `time_min`: Start time
- `time_max`: End time
- `items`: Array of calendar IDs

### 17. GOOGLECALENDAR_GET_CALENDAR
Gets calendar information.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID

### 18. GOOGLECALENDAR_GET_CURRENT_DATE_TIME
Gets the current date and time.

**Parameters:**
```json
{}
```

### 19. GOOGLECALENDAR_LIST_ACL_RULES
Lists access control rules for a calendar.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID

### 20. GOOGLECALENDAR_LIST_CALENDARS
Lists all calendars.

**Parameters:**
```json
{}
```

### 21. GOOGLECALENDAR_PATCH_CALENDAR
Updates calendar properties partially.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "summary": "Updated Name"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID

### 22. GOOGLECALENDAR_PATCH_EVENT
Updates event properties partially.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "event_id": "event_id_string",
  "summary": "Updated Event Title"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID
- `event_id`: The event ID

### 23. GOOGLECALENDAR_QUICK_ADD
Quickly adds an event using natural language.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "text": "Meeting with John tomorrow at 3pm"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID
- `text`: Natural language event description

### 24. GOOGLECALENDAR_REMOVE_ATTENDEE
Removes an attendee from an event.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "event_id": "event_id_string",
  "attendee_email": "attendee@example.com"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID
- `event_id`: The event ID
- `attendee_email`: Email of attendee to remove

### 25. GOOGLECALENDAR_SETTINGS_LIST
Lists calendar settings.

**Parameters:**
```json
{}
```

### 26. GOOGLECALENDAR_SETTINGS_WATCH
Watches for changes to settings.

**Parameters:**
```json
{
  "address": "https://example.com/webhook"
}
```

**Required Fields:**
- `address`: Webhook URL

### 27. GOOGLECALENDAR_SYNC_EVENTS
Syncs events from a calendar.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "sync_token": "sync_token_string"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID

### 28. GOOGLECALENDAR_UPDATE_ACL_RULE
Updates an access control rule.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "rule_id": "rule_id_string",
  "role": "writer"
}
```

**Required Fields:**
- `calendar_id`: The calendar ID
- `rule_id`: The ACL rule ID

### 29. GOOGLECALENDAR_UPDATE_EVENT
Updates an event.

**Parameters:**
```json
{
  "calendar_id": "calendar_id_string",
  "event_id": "event_id_string",
  "summary": "Updated Event Title",
  "start": {
    "date_time": "2024-01-01T10:00:00Z"
  },
  "end": {
    "date_time": "2024-01-01T11:00:00Z"
  }
}
```

**Required Fields:**
- `calendar_id`: The calendar ID
- `event_id`: The event ID

## Usage Pattern in Rube MCP

```javascript
const result = await callRubeTool('GOOGLECALENDAR_EVENTS_LIST', {
  calendar_id: 'primary',
  time_min: '2024-01-01T00:00:00Z',
  max_results: 10
});
```

## Simplifying Google Calendar Tool Calls

### Helper Functions
```javascript
async function createEvent(calendarId, summary, startTime, endTime, options = {}) {
  return await callRubeTool('GOOGLECALENDAR_CREATE_EVENT', {
    calendar_id: calendarId,
    summary,
    start: { date_time: startTime },
    end: { date_time: endTime },
    ...options
  });
}

async function listUpcomingEvents(calendarId = 'primary', maxResults = 10) {
  const now = new Date().toISOString();
  return await callRubeTool('GOOGLECALENDAR_EVENTS_LIST', {
    calendar_id: calendarId,
    time_min: now,
    max_results: maxResults,
    single_events: true,
    order_by: 'startTime'
  });
}

async function findFreeTime(duration = 'PT1H', calendars = ['primary']) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await callRubeTool('GOOGLECALENDAR_FIND_FREE_SLOTS', {
    time_min: today.toISOString(),
    time_max: tomorrow.toISOString(),
    duration,
    calendar_ids: calendars
  });
}

async function quickAddEvent(calendarId, description) {
  return await callRubeTool('GOOGLECALENDAR_QUICK_ADD', {
    calendar_id: calendarId,
    text: description
  });
}
```

### Meeting Scheduling Example
```javascript
async function scheduleMeeting(title, attendees, duration = 60) {
  // Find free time for all attendees
  const freeSlots = await findFreeTime(`PT${duration}M`, ['primary']);

  if (freeSlots.length === 0) {
    throw new Error('No free time slots available');
  }

  // Create the meeting
  const startTime = freeSlots[0].start;
  const endTime = new Date(new Date(startTime).getTime() + duration * 60000).toISOString();

  return await createEvent('primary', title, startTime, endTime, {
    attendees: attendees.map(email => ({ email })),
    reminders: {
      use_default: true
    }
  });
}
```

### Calendar Management Example
```javascript
async function setupWorkCalendar() {
  // Create a work calendar
  const calendar = await callRubeTool('GOOGLECALENDAR_CALENDARS_UPDATE', {
    calendar_id: 'primary',
    summary: 'Work Calendar',
    description: 'Professional meetings and events'
  });

  // Set up recurring team standup
  await quickAddEvent(calendar.id, 'Daily Standup every weekday at 9am');

  // Share with team
  await callRubeTool('GOOGLECALENDAR_ACL_PATCH', {
    calendar_id: calendar.id,
    rule_id: 'team_rule',
    role: 'reader',
    scope: {
      type: 'group',
      value: 'team@example.com'
    }
  });

  return calendar;
}
```
# Google Drive Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: 3 requests/second per integration
- **Authentication**: Google OAuth integration required
- **Scopes**: Drive file access (read/write)
- **Thread Safety**: Operations are thread-safe

## Available Google Drive Tool Calls

### 1. GOOGLEDRIVE_ADD_FILE_SHARING_PREFERENCE
Adds sharing preferences to a file.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "role": "reader|writer|owner",
  "type": "user|group|domain|anyone",
  "email_address": "user@example.com"
}
```

**Required Fields:**
- `file_id`: The file ID
- `role`: Permission role
- `type`: Permission type

### 2. GOOGLEDRIVE_COPY_FILE
Creates a copy of a file.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "name": "Copy of file",
  "parents": ["folder_id"]
}
```

**Required Fields:**
- `file_id`: The file ID to copy

### 3. GOOGLEDRIVE_CREATE_COMMENT
Creates a comment on a file.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "content": "Comment text"
}
```

**Required Fields:**
- `file_id`: The file ID
- `content`: Comment content

### 4. GOOGLEDRIVE_CREATE_DRIVE
Creates a new shared drive.

**Parameters:**
```json
{
  "name": "Drive Name",
  "background_image_file": {},
  "color_rgb": "#ffffff"
}
```

**Required Fields:**
- `name`: Drive name

### 5. GOOGLEDRIVE_CREATE_FILE
Creates a new file.

**Parameters:**
```json
{
  "name": "file.txt",
  "parents": ["folder_id"],
  "mime_type": "text/plain"
}
```

**Required Fields:**
- `name`: File name

### 6. GOOGLEDRIVE_CREATE_FILE_FROM_TEXT
Creates a file from text content.

**Parameters:**
```json
{
  "name": "file.txt",
  "content": "File content",
  "parents": ["folder_id"]
}
```

**Required Fields:**
- `name`: File name
- `content`: File content

### 7. GOOGLEDRIVE_CREATE_FOLDER
Creates a new folder.

**Parameters:**
```json
{
  "name": "Folder Name",
  "parents": ["parent_folder_id"]
}
```

**Required Fields:**
- `name`: Folder name

### 8. GOOGLEDRIVE_CREATE_REPLY
Creates a reply to a comment.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "comment_id": "comment_id_string",
  "content": "Reply content"
}
```

**Required Fields:**
- `file_id`: The file ID
- `comment_id`: The comment ID
- `content`: Reply content

### 9. GOOGLEDRIVE_CREATE_SHORTCUT_TO_FILE
Creates a shortcut to a file.

**Parameters:**
```json
{
  "name": "Shortcut Name",
  "target_id": "target_file_id",
  "parents": ["folder_id"]
}
```

**Required Fields:**
- `name`: Shortcut name
- `target_id`: Target file ID

### 10. GOOGLEDRIVE_DELETE_COMMENT
Deletes a comment.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "comment_id": "comment_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID
- `comment_id`: The comment ID

### 11. GOOGLEDRIVE_DELETE_DRIVE
Deletes a shared drive.

**Parameters:**
```json
{
  "drive_id": "drive_id_string"
}
```

**Required Fields:**
- `drive_id`: The drive ID to delete

### 12. GOOGLEDRIVE_DELETE_PERMISSION
Deletes a permission from a file.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "permission_id": "permission_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID
- `permission_id`: The permission ID

### 13. GOOGLEDRIVE_DELETE_REPLY
Deletes a reply to a comment.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "comment_id": "comment_id_string",
  "reply_id": "reply_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID
- `comment_id`: The comment ID
- `reply_id`: The reply ID

### 14. GOOGLEDRIVE_DOWNLOAD_FILE
Downloads a file.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "mime_type": "application/pdf"
}
```

**Required Fields:**
- `file_id`: The file ID to download

### 15. GOOGLEDRIVE_EDIT_FILE
Edits file content.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "content": "New content",
  "mime_type": "text/plain"
}
```

**Required Fields:**
- `file_id`: The file ID
- `content`: New content

### 16. GOOGLEDRIVE_EMPTY_TRASH
Empties the trash.

**Parameters:**
```json
{}
```

### 17. GOOGLEDRIVE_FILES_MODIFY_LABELS
Modifies labels on files.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "add_labels": ["label_id"],
  "remove_labels": ["label_id"]
}
```

**Required Fields:**
- `file_id`: The file ID

### 18. GOOGLEDRIVE_FIND_FILE
Searches for files.

**Parameters:**
```json
{
  "query": "name contains 'document'",
  "page_size": 10
}
```

### 19. GOOGLEDRIVE_FIND_FOLDER
Searches for folders.

**Parameters:**
```json
{
  "query": "name contains 'project'",
  "page_size": 10
}
```

### 20. GOOGLEDRIVE_GENERATE_IDS
Generates file IDs.

**Parameters:**
```json
{
  "count": 10,
  "space": "drive"
}
```

### 21. GOOGLEDRIVE_GET_ABOUT
Gets information about the user's Drive.

**Parameters:**
```json
{}
```

### 22. GOOGLEDRIVE_GET_CHANGES_START_PAGE_TOKEN
Gets the start page token for changes.

**Parameters:**
```json
{}
```

### 23. GOOGLEDRIVE_GET_COMMENT
Gets a specific comment.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "comment_id": "comment_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID
- `comment_id`: The comment ID

### 24. GOOGLEDRIVE_GET_DRIVE
Gets information about a shared drive.

**Parameters:**
```json
{
  "drive_id": "drive_id_string"
}
```

**Required Fields:**
- `drive_id`: The drive ID

### 25. GOOGLEDRIVE_GET_FILE_METADATA
Gets file metadata.

**Parameters:**
```json
{
  "file_id": "file_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID

### 26. GOOGLEDRIVE_GET_PERMISSION
Gets permission details.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "permission_id": "permission_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID
- `permission_id`: The permission ID

### 27. GOOGLEDRIVE_GET_REPLY
Gets a reply to a comment.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "comment_id": "comment_id_string",
  "reply_id": "reply_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID
- `comment_id`: The comment ID
- `reply_id`: The reply ID

### 28. GOOGLEDRIVE_GET_REVISION
Gets file revision information.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "revision_id": "revision_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID
- `revision_id`: The revision ID

### 29. GOOGLEDRIVE_GOOGLE_DRIVE_DELETE_FOLDER_OR_FILE_ACTION
Deletes a file or folder.

**Parameters:**
```json
{
  "file_id": "file_id_string"
}
```

**Required Fields:**
- `file_id`: The file or folder ID to delete

### 30. GOOGLEDRIVE_HIDE_DRIVE
Hides a shared drive.

**Parameters:**
```json
{
  "drive_id": "drive_id_string"
}
```

**Required Fields:**
- `drive_id`: The drive ID to hide

### 31. GOOGLEDRIVE_LIST_CHANGES
Lists changes to files.

**Parameters:**
```json
{
  "page_token": "page_token_string",
  "page_size": 100
}
```

### 32. GOOGLEDRIVE_LIST_COMMENTS
Lists comments on a file.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "page_size": 10
}
```

**Required Fields:**
- `file_id`: The file ID

### 33. GOOGLEDRIVE_LIST_FILE_LABELS
Lists labels on a file.

**Parameters:**
```json
{
  "file_id": "file_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID

### 34. GOOGLEDRIVE_LIST_FILES
Lists files in Drive.

**Parameters:**
```json
{
  "page_size": 100,
  "query": "trashed = false"
}
```

### 35. GOOGLEDRIVE_LIST_PERMISSIONS
Lists permissions on a file.

**Parameters:**
```json
{
  "file_id": "file_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID

### 36. GOOGLEDRIVE_LIST_REPLIES_TO_COMMENT
Lists replies to a comment.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "comment_id": "comment_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID
- `comment_id`: The comment ID

### 37. GOOGLEDRIVE_LIST_REVISIONS
Lists revisions of a file.

**Parameters:**
```json
{
  "file_id": "file_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID

### 38. GOOGLEDRIVE_LIST_SHARED_DRIVES
Lists shared drives.

**Parameters:**
```json
{
  "page_size": 10
}
```

### 39. GOOGLEDRIVE_MOVE_FILE
Moves a file to a new location.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "add_parents": ["new_folder_id"],
  "remove_parents": ["old_folder_id"]
}
```

**Required Fields:**
- `file_id`: The file ID to move

### 40. GOOGLEDRIVE_RESUMABLE_UPLOAD
Uploads large files using resumable upload.

**Parameters:**
```json
{
  "name": "large_file.zip",
  "parents": ["folder_id"],
  "file_path": "/path/to/file"
}
```

**Required Fields:**
- `name`: File name
- `file_path`: Local file path

### 41. GOOGLEDRIVE_STOP_WATCH_CHANNEL
Stops watching changes on a channel.

**Parameters:**
```json
{
  "channel_id": "channel_id_string",
  "resource_id": "resource_id_string"
}
```

**Required Fields:**
- `channel_id`: The channel ID
- `resource_id`: The resource ID

### 42. GOOGLEDRIVE_UNHIDE_DRIVE
Unhides a shared drive.

**Parameters:**
```json
{
  "drive_id": "drive_id_string"
}
```

**Required Fields:**
- `drive_id`: The drive ID to unhide

### 43. GOOGLEDRIVE_UNTRASH_FILE
Restores a file from trash.

**Parameters:**
```json
{
  "file_id": "file_id_string"
}
```

**Required Fields:**
- `file_id`: The file ID to restore

### 44. GOOGLEDRIVE_UPDATE_COMMENT
Updates a comment.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "comment_id": "comment_id_string",
  "content": "Updated comment"
}
```

**Required Fields:**
- `file_id`: The file ID
- `comment_id`: The comment ID

### 45. GOOGLEDRIVE_UPDATE_DRIVE
Updates shared drive properties.

**Parameters:**
```json
{
  "drive_id": "drive_id_string",
  "name": "New Drive Name"
}
```

**Required Fields:**
- `drive_id`: The drive ID

### 46. GOOGLEDRIVE_UPDATE_FILE_PUT
Updates file content using PUT.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "content": "New content"
}
```

**Required Fields:**
- `file_id`: The file ID

### 47. GOOGLEDRIVE_UPDATE_FILE_REVISION_METADATA
Updates revision metadata.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "revision_id": "revision_id_string",
  "keep_forever": true
}
```

**Required Fields:**
- `file_id`: The file ID
- `revision_id`: The revision ID

### 48. GOOGLEDRIVE_UPDATE_PERMISSION
Updates file permissions.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "permission_id": "permission_id_string",
  "role": "writer"
}
```

**Required Fields:**
- `file_id`: The file ID
- `permission_id`: The permission ID

### 49. GOOGLEDRIVE_UPDATE_REPLY
Updates a reply to a comment.

**Parameters:**
```json
{
  "file_id": "file_id_string",
  "comment_id": "comment_id_string",
  "reply_id": "reply_id_string",
  "content": "Updated reply"
}
```

**Required Fields:**
- `file_id`: The file ID
- `comment_id`: The comment ID
- `reply_id`: The reply ID

### 50. GOOGLEDRIVE_UPLOAD_FILE
Uploads a file to Drive.

**Parameters:**
```json
{
  "name": "file.txt",
  "parents": ["folder_id"],
  "file_path": "/path/to/file"
}
```

**Required Fields:**
- `name`: File name
- `file_path`: Local file path

### 51. GOOGLEDRIVE_WATCH_CHANGES
Watches for changes to files.

**Parameters:**
```json
{
  "page_token": "page_token_string",
  "include_corpus_removals": false,
  "include_items_from_all_drives": false
}
```

## Usage Pattern in Rube MCP

```javascript
const result = await callRubeTool('GOOGLEDRIVE_LIST_FILES', {
  page_size: 10,
  query: "name contains 'document'"
});
```

## Simplifying Google Drive Tool Calls

### Helper Functions
```javascript
async function uploadFile(name, filePath, folderId = null) {
  const params = { name, file_path: filePath };
  if (folderId) params.parents = [folderId];
  return await callRubeTool('GOOGLEDRIVE_UPLOAD_FILE', params);
}

async function createFolder(name, parentId = null) {
  const params = { name };
  if (parentId) params.parents = [parentId];
  return await callRubeTool('GOOGLEDRIVE_CREATE_FOLDER', params);
}

async function shareFile(fileId, email, role = 'reader') {
  return await callRubeTool('GOOGLEDRIVE_ADD_FILE_SHARING_PREFERENCE', {
    file_id: fileId,
    role,
    type: 'user',
    email_address: email
  });
}

async function searchFiles(query, maxResults = 10) {
  return await callRubeTool('GOOGLEDRIVE_FIND_FILE', {
    query,
    page_size: maxResults
  });
}
```

### File Management Example
```javascript
async function setupProjectFolder(projectName) {
  // Create main project folder
  const projectFolder = await createFolder(projectName);

  // Create subfolders
  const docsFolder = await createFolder('Documents', projectFolder.id);
  const assetsFolder = await createFolder('Assets', projectFolder.id);

  // Upload initial files
  await uploadFile('README.md', './README.md', docsFolder.id);
  await uploadFile('logo.png', './logo.png', assetsFolder.id);

  return {
    project: projectFolder,
    documents: docsFolder,
    assets: assetsFolder
  };
}
```

### Collaboration Example
```javascript
async function setupTeamAccess(fileId, teamMembers) {
  for (const member of teamMembers) {
    await shareFile(fileId, member.email, 'writer');
  }

  // Add a comment for the team
  await callRubeTool('GOOGLEDRIVE_CREATE_COMMENT', {
    file_id: fileId,
    content: `Shared with team: ${teamMembers.map(m => m.name).join(', ')}`
  });
}
```
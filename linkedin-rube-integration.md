# LinkedIn Tools in Rube MCP Server

## Rate Limits & Requirements
- **Rate Limit**: 100 calls per day for most endpoints
- **Authentication**: LinkedIn OAuth 2.0 required
- **Scopes**: r_liteprofile, r_emailaddress, w_member_social
- **Thread Safety**: Operations are thread-safe

## Available LinkedIn Tool Calls

### 1. LINKEDIN_CREATE_LINKED_IN_POST
Creates a new post on LinkedIn.

**Parameters:**
```json
{
  "author": "urn:li:person:{person_id}",
  "lifecycleState": "PUBLISHED",
  "specificContent": {
    "com.linkedin.ugc.ShareContent": {
      "shareCommentary": {
        "text": "Excited to share my latest project!"
      },
      "shareMediaCategory": "NONE"
    }
  },
  "visibility": {
    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
  }
}
```

**Required Fields:**
- `author`: Author URN
- `lifecycleState`: Post state
- `specificContent`: Post content
- `visibility`: Post visibility

### 2. LINKEDIN_DELETE_LINKED_IN_POST
Deletes a LinkedIn post.

**Parameters:**
```json
{
  "post_id": "urn:li:ugcPost:{post_id}"
}
```

**Required Fields:**
- `post_id`: The post URN to delete

### 3. LINKEDIN_GET_COMPANY_INFO
Gets information about a LinkedIn company.

**Parameters:**
```json
{
  "company_id": "company_id_string"
}
```

**Required Fields:**
- `company_id`: The company ID

### 4. LINKEDIN_GET_MY_INFO
Gets the authenticated user's LinkedIn profile information.

**Parameters:**
```json
{}
```

## Usage Pattern in Rube MCP

```javascript
const result = await callRubeTool('LINKEDIN_CREATE_LINKED_IN_POST', {
  author: 'urn:li:person:123456789',
  lifecycleState: 'PUBLISHED',
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: {
        text: 'Sharing my thoughts on AI development!'
      },
      shareMediaCategory: 'NONE'
    }
  },
  visibility: {
    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
  }
});
```

## Simplifying LinkedIn Tool Calls

### Helper Functions
```javascript
async function createPost(text, authorUrn, options = {}) {
  return await callRubeTool('LINKEDIN_CREATE_LINKED_IN_POST', {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text
        },
        shareMediaCategory: 'NONE'
      }
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
    },
    ...options
  });
}

async function deletePost(postUrn) {
  return await callRubeTool('LINKEDIN_DELETE_LINKED_IN_POST', {
    post_id: postUrn
  });
}

async function getProfileInfo() {
  return await callRubeTool('LINKEDIN_GET_MY_INFO', {});
}

async function getCompanyInfo(companyId) {
  return await callRubeTool('LINKEDIN_GET_COMPANY_INFO', {
    company_id: companyId
  });
}
```

### Professional Networking Example
```javascript
async function shareProfessionalUpdate(updateText, authorUrn) {
  const post = await createPost(
    `${updateText}\n\n#ProfessionalDevelopment #CareerGrowth`,
    authorUrn,
    {
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    }
  );

  return {
    postId: post.id,
    postUrn: post.urn,
    created: new Date().toISOString()
  };
}

async function shareProjectMilestone(projectName, milestone, authorUrn) {
  const postText = `🎉 Just reached a major milestone on ${projectName}!\n\n${milestone}\n\nExcited to share this progress with my network.`;

  return await createPost(postText, authorUrn);
}
```

### Company Information and Networking Example
```javascript
async function analyzeCompanyProfile(companyId) {
  const companyInfo = await getCompanyInfo(companyId);

  return {
    name: companyInfo.localizedName,
    description: companyInfo.localizedDescription,
    website: companyInfo.website,
    industry: companyInfo.industries?.[0],
    employeeCount: companyInfo.employeeCountRange?.start,
    headquarters: companyInfo.geographicArea?.localizedName
  };
}

async function getNetworkProfile() {
  const profile = await getProfileInfo();

  return {
    id: profile.id,
    firstName: profile.localizedFirstName,
    lastName: profile.localizedLastName,
    headline: profile.localizedHeadline,
    summary: profile.summary,
    industry: profile.industry?.localizedName,
    location: profile.geoLocation?.localizedName,
    profilePicture: profile.profilePicture?.displayImage
  };
}
```

### Content Management Example
```javascript
async function manageContentCalendar(posts, authorUrn) {
  const results = [];

  for (const post of posts) {
    try {
      const createdPost = await createPost(post.content, authorUrn, post.options);
      results.push({
        id: post.id,
        postUrn: createdPost.urn,
        status: 'posted',
        scheduledFor: post.scheduledFor
      });
    } catch (error) {
      results.push({
        id: post.id,
        status: 'failed',
        error: error.message
      });
    }
  }

  return results;
}

async function cleanupOldPosts(postUrns) {
  const results = [];

  for (const postUrn of postUrns) {
    try {
      await deletePost(postUrn);
      results.push({
        postUrn,
        status: 'deleted'
      });
    } catch (error) {
      results.push({
        postUrn,
        status: 'failed',
        error: error.message
      });
    }
  }

  return results;
}
```
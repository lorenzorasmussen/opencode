#!/usr/bin/env node

/**
 * Test Notion Page Creation via Rube MCP
 * Creates a test page to verify Notion integration
 */

import https from 'https';

async function testNotionPage() {
  console.log('📝 Testing Notion Page Creation via Rube MCP...\n');

  const apiKey = process.env.RUBE_AUTH;
  if (!apiKey) {
    console.error('❌ RUBE_AUTH not set');
    console.log('💡 Set it with: export RUBE_AUTH=your_token_here');
    return;
  }

  try {
    console.log('📤 Creating test Notion page...');

    // Create a test page with content demonstrating MCP integration
    const pageData = {
      parent_id: "your-parent-page-id-here", // User will need to provide this
      title: "OpenCode MCP Integration Test",
      content: "This is the initial content for the test page."
    };

    const result = await callNotionTool('NOTION_CREATE_NOTION_PAGE', pageData);

    if (result && result.id) {
      console.log('✅ Test page created successfully!');
      console.log('📄 Page ID:', result.id);
      console.log('🔗 URL:', result.url);

      // Now add detailed content
      const contentData = {
        block_id: result.id,
        children: [
          {
            object: "block",
            type: "heading_1",
            heading_1: {
              rich_text: [
                {
                  text: {
                    content: "🎉 MCP Integration Test Successful!"
                  }
                }
              ]
            }
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: "This page was created automatically by OpenCode using the Rube MCP server integration."
                  }
                }
              ]
            }
          },
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [
                {
                  text: {
                    content: "Available Tools Summary"
                  }
                }
              ]
            }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: {
              rich_text: [
                {
                  text: {
                    content: "📧 Gmail: Email management and automation"
                  }
                }
              ]
            }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: {
              rich_text: [
                {
                  text: {
                    content: "📅 Google Calendar: Event scheduling and management"
                  }
                }
              ]
            }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: {
              rich_text: [
                {
                  text: {
                    content: "📁 Google Drive: File storage and collaboration"
                  }
                }
              ]
            }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: {
              rich_text: [
                {
                  text: {
                    content: "🗃️ Supabase: Database operations and backend services"
                  }
                }
              ]
            }
          },
          {
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: {
              rich_text: [
                {
                  text: {
                    content: "🤖 AI Services: Gemini, OpenRouter, and more"
                  }
                }
              ]
            }
          },
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [
                {
                  text: {
                    content: "Total Integration"
                  }
                }
              ]
            }
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: "✅ 333 tools across 14 service categories"
                  }
                }
              ]
            }
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: "✅ MCP server fully operational"
                  }
                }
              ]
            }
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: "✅ OpenCode integration complete"
                  }
                }
              ]
            }
          }
        ]
      };

      const contentResult = await callNotionTool('NOTION_APPEND_BLOCK_CHILDREN', contentData);
      if (contentResult) {
        console.log('✅ Content added to page successfully!');
      } else {
        console.log('⚠️ Page created but content addition failed');
      }
    } else {
      console.log('❌ Page creation failed - check your Notion integration setup');
      console.log('💡 Make sure:');
      console.log('   1. Notion integration is connected in Composio');
      console.log('   2. You have a valid parent page ID');
      console.log('   3. The integration has necessary permissions');
    }

  } catch (error) {
    console.error('❌ Notion test failed:', error.message);
  }
}

async function callNotionTool(toolName, params) {
  return new Promise((resolve, reject) => {
    const endpointUrl = process.env.RUBE_ENDPOINT || 'https://backend.composio.dev/v3/mcp/24168591-405a-47f1-8122-07437cafcb2b/mcp?user_id=pg-test-aeec135f-d18b-4714-957b-cbeeccabe472';
    const url = new URL(endpointUrl);

    const requestData = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: params
      }
    };

    const data = JSON.stringify(requestData);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'Authorization': `Bearer ${process.env.RUBE_AUTH}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            // Handle event stream format: "event: message\ndata: {json}"
            let jsonBody = body;
            if (body.startsWith('event: message\ndata: ')) {
              jsonBody = body.replace('event: message\ndata: ', '');
            }
            const response = JSON.parse(jsonBody);
            if (response.result) {
              // Extract the actual data from the Composio response format
              if (response.result.content && response.result.content[0] && response.result.content[0].text) {
                const innerJson = JSON.parse(response.result.content[0].text);
                if (innerJson.successful || innerJson.successfull) {
                  resolve(innerJson.data || innerJson);
                } else {
                  reject(new Error(innerJson.error || 'Tool call failed'));
                }
              } else {
                resolve(response.result);
              }
            } else if (response.error) {
              reject(new Error(response.error.message || 'Tool call failed'));
            } else {
              resolve(null);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Run the Notion test
testNotionPage().then(() => {
  console.log('\n✅ Notion page test completed');
}).catch(error => {
  console.error('❌ Notion page test failed:', error);
  process.exit(1);
});
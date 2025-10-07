export default () => ({
  name: "notification",
  description: "Send notifications on task completion",
  hooks: {
    beforeCommand: (command: string) => {
      console.log(`Starting: ${command}`);
    },
     afterCommand: (command: string) => {
      // Send notification (Slack, email, etc.)
      if (process.env.NOTIFICATION_WEBHOOK) {
        fetch(process.env.NOTIFICATION_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `OpenCode completed: ${command}`
          })
        });
      }
    }
  }
});
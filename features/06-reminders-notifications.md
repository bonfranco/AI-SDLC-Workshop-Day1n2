# 6. Reminders & Notifications

### What It Does
Receive browser notifications before your todos are due to stay on top of deadlines.

### How to Enable
1. Click **"🔔 Enable Notifications"** button (orange, top-right)
2. Grant browser notification permission when prompted
3. Once enabled, button shows **"🔔 Notifications On"** (green badge)

### Setting Reminders

When creating or editing a todo with a due date:

1. Use the **"Reminder"** dropdown
2. Select timing:
   - 15 minutes before
   - 30 minutes before
   - 1 hour before
   - 2 hours before
   - 1 day before
   - 2 days before
   - 1 week before
3. Select "None" to remove reminder

### Requirements
- ⚠️ Todo must have a due date
- ⚠️ Reminder field disabled if no due date set
- ⚠️ Browser must support notifications
- ⚠️ Permission must be granted

### Visual Indicators
Todos with reminders show a **🔔 badge** with abbreviated time:
- `🔔 15m` - 15 minutes
- `🔔 30m` - 30 minutes
- `🔔 1h` - 1 hour
- `🔔 2h` - 2 hours
- `🔔 1d` - 1 day
- `🔔 2d` - 2 days
- `🔔 1w` - 1 week

### How It Works
- System checks every minute for pending reminders
- Notification sent when reminder time arrives
- Each reminder only sent once (tracked via `last_notification_sent`)
- Notifications persist until acknowledged
- Works even if browser tab is in background

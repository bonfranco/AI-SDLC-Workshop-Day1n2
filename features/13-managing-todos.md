# 13. Managing Todos

### Completing Todos

#### How to Complete
1. Locate todo in list (Overdue or Pending section)
2. Click **checkbox** on left side
3. Todo moves to **"Completed"** section
4. Checkbox shows checkmark (✓)

#### Recurring Todo Completion
1. Click checkbox on recurring todo
2. Current instance marked complete
3. **New instance automatically created** for next occurrence
4. New instance has:
   - Same title
   - Same priority
   - Same recurrence settings
   - Same tags
   - Next due date (calculated by pattern)

#### Uncompleting Todos
1. Find todo in Completed section
2. Click **checked checkbox**
3. Todo returns to appropriate section:
   - Overdue (if past due date)
   - Pending (if future or no due date)

### Editing Todos

#### Opening Edit Modal
1. Find todo in any section
2. Click **"Edit"** button (blue text, right side)
3. Modal opens with current values pre-filled

#### Edit Modal Fields

**Available Fields**:
- **Title**: Text input (required)
- **Due Date**: Date-time picker (optional)
- **Priority**: Dropdown (High/Medium/Low)
- **Repeat**: Checkbox (enable/disable recurrence)
- **Recurrence Pattern**: Dropdown (if Repeat enabled)
  - Daily
  - Weekly
  - Monthly
  - Yearly
- **Reminder**: Dropdown (if due date set)
  - None
  - 15 minutes before
  - 30 minutes before
  - 1 hour before
  - 2 hours before
  - 1 day before
  - 2 days before
  - 1 week before
- **Tags**: Tag selection pills (multi-select)

#### Saving Changes
1. Modify any fields as needed
2. Click **"Update"** button (blue, bottom of modal)
3. Modal closes
4. Todo updates in list
5. Moves to correct section if needed (based on new due date)

#### Canceling Edit
1. Click **"Cancel"** button (gray, bottom of modal)
2. Click outside modal (modal overlay)
3. Press Escape key (if supported)
4. No changes saved

### Deleting Todos

#### How to Delete
1. Locate todo in any section
2. Click **"Delete"** button (red text, right side)
3. Todo **immediately deleted** (no confirmation)
4. Removed from list instantly

#### What Gets Deleted
- ✅ Todo item
- ✅ All subtasks (CASCADE delete)
- ✅ Tag associations
- ✅ Progress data
- ✅ Reminder settings

#### Cannot Be Undone
- ⚠️ **Permanent deletion**
- ⚠️ No "undo" feature
- ⚠️ No confirmation dialog
- ⚠️ Export before deleting important todos

### Todo Organization

#### Automatic Sections

Todos are organized into three sections:

**1. Overdue Section** (if any exist)
- **Condition**: Past due date AND not completed
- **Color**: Red background
- **Icon**: ⚠️ Warning icon
- **Counter**: "Overdue (X)"
- **Sort Order**: Priority → Due date → Creation date

**2. Pending Section**
- **Condition**: Future due date OR no due date, AND not completed
- **Color**: Gray background
- **Counter**: "Pending (X)"
- **Sort Order**: Priority → Due date → Creation date

**3. Completed Section**
- **Condition**: Completed checkbox checked
- **Color**: Standard background
- **Counter**: "Completed (X)"
- **Sort Order**: Completion date (newest first)

### Automatic Sorting

#### Sort Priority (within each section)
1. **Priority Level**: High → Medium → Low
2. **Due Date**: Earliest → Latest
3. **Creation Date**: Newest → Oldest (for same priority/due date)

#### Examples
```
Sort Result:
1. High priority, due today
2. High priority, due tomorrow
3. Medium priority, due today
4. Medium priority, due next week
5. Low priority, due tomorrow
6. Low priority, no due date
```

### Todo Display Elements

#### Each Todo Shows

**Left Side**:
- ☐ Checkbox (empty) or ☑ Checkbox (checked)

**Center Area**:
- **Title** (main text)
- **Badges** (inline):
  - Priority badge (colored)
  - 🔄 Recurrence badge (if recurring)
  - 🔔 Reminder badge (if set)
  - Tag pills (if tagged)
- **Due Date** (if set, color-coded by urgency)
- **Progress Bar** (if subtasks exist)
  - "X/Y subtasks" text
  - Visual bar (0-100%)

**Right Side**:
- **"▶ Subtasks"** button (or "▼ Subtasks" if expanded)
- **"Edit"** button (blue)
- **"Delete"** button (red)

### Subtask Expansion

#### Collapsed State (Default)
- Button shows: **"▶ Subtasks"**
- Subtasks hidden
- Progress bar visible (if subtasks exist)
- Progress text visible

#### Expanded State
- Button shows: **"▼ Subtasks"**
- Subtask list visible
- Add subtask form visible
- Individual subtask checkboxes and delete buttons

### Keyboard Shortcuts

#### General
- **Enter** in subtask input → Add subtask
- **Escape** in modal → Close modal (if implemented)

#### Quick Actions
- Click checkbox → Toggle completion
- Click tag pill → Select/deselect tag (in forms)
- Click ✕ → Clear search / delete item

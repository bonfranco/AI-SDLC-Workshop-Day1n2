# 10. Search & Advanced Filtering

### What It Does
Powerful search and filtering system to find exactly the todos you need with multi-criteria filtering and saved presets.

### Search Bar

#### Location & Appearance
- Located at top of todo list (below todo form)
- Full-width input with search icon (🔍)
- Placeholder: "Search todos and subtasks..."
- Clear button (✕) appears when typing

#### How It Works
- **Searches**: Todo titles AND subtask titles
- **Real-time**: Results update as you type
- **Case-insensitive**: Finds "meeting" or "Meeting"
- **Partial match**: "proj" finds "project" and "projection"
- **Clear**: Click ✕ or delete all text

#### Search Behavior
```
Search: "report"
Finds:
✓ "Monthly Report" (todo title)
✓ "Meeting Notes" with subtask "Send report to team"
✓ "Project Alpha" with subtask "Quarterly reporting"
```

### Quick Filters

Located below search bar in a horizontal row:

#### Priority Filter
- Dropdown: "All Priorities"
- Options:
  - All Priorities (default)
  - High Priority
  - Medium Priority
  - Low Priority
- Combines with other filters

#### Tag Filter
- Dropdown: "All Tags"
- Shows only if tags exist
- Options:
  - All Tags (default)
  - Individual tag names
- Combines with other filters

#### Advanced Toggle
- Button: "▶ Advanced" (collapsed) or "▼ Advanced" (expanded)
- Toggles advanced filters panel
- Blue background when active
- Gray background when inactive

#### Active Filter Actions
Appears when ANY filter is active:
- **"Clear All"** button (red) - Removes all filters instantly
- **"💾 Save Filter"** button (green) - Opens save filter modal

### Advanced Filters Panel

Click "▶ Advanced" to reveal:

#### 1. Completion Status
- **Dropdown** with options:
  - All Todos (default)
  - Incomplete Only
  - Completed Only
- Filters based on checkbox state

#### 2. Date Range
Two date inputs side-by-side:

**Due Date From**
- Start of date range
- Format: YYYY-MM-DD
- Optional (can use alone)

**Due Date To**
- End of date range
- Format: YYYY-MM-DD
- Optional (can use alone)

**Behavior**:
- Use both for specific range
- Use "From" only: all todos after that date
- Use "To" only: all todos before that date
- Only shows todos WITH due dates

#### 3. Saved Filter Presets
Displayed if any presets exist:
- **Preset pills** with name
- **Apply button**: Click name to apply
- **Delete button**: Click ✕ to remove
- **Format**: `[Preset Name] [✕]`

### Saving Filter Presets

#### How to Save
1. Apply any combination of filters:
   - Search query
   - Priority
   - Tag
   - Date range
   - Completion status
2. Click **"💾 Save Filter"** button (appears when filters active)
3. Modal opens showing:
   - Name input field
   - Current filter preview
4. Enter preset name
5. Click **"Save"**

#### Save Filter Modal

**Shows Current Filters**:
- ✓ Search query (if entered)
- ✓ Priority filter (if selected)
- ✓ Tag filter (if selected)
- ✓ Date range (if set)
- ✓ Completion filter (if not "all")

**Example Preview**:
```
Current Filters:
• Search: "meeting"
• Priority: High
• Tag: Work
• Completion: Incomplete
• Date Range: 2025-11-01 to 2025-11-07
```

#### Preset Storage
- **Location**: Browser localStorage
- **Persistence**: Survives page refresh
- **User-specific**: Per browser/device
- **Format**: JSON object

### Applying Saved Presets

#### Method 1: From Advanced Panel
1. Open advanced filters
2. Find "Saved Filter Presets" section
3. Click preset name
4. All filters applied instantly

#### Method 2: Quick Application
- Presets visible when advanced panel open
- One-click application
- Overwrites current filters

### Managing Presets

#### Deleting Presets
1. Locate preset in advanced panel
2. Click ✕ button next to name
3. Confirm deletion
4. Preset removed from localStorage

### Filter Combinations

#### How Filters Work Together
All active filters use **AND** logic (must match all):

**Example**:
```
Search: "report"
Priority: High
Tag: Work
Date: 2025-11-01 to 2025-11-07
Completion: Incomplete

Result: Shows only todos that are:
✓ Contain "report" in title or subtasks
✓ AND have High priority
✓ AND tagged with "Work"
✓ AND due between Nov 1-7
✓ AND not completed
```

#### Filter Priority
1. Search filter applied first
2. Priority filter
3. Tag filter
4. Completion filter
5. Date range filter (last)

### Filter Indicators

#### Active Filter State
- "Clear All" and "Save Filter" buttons visible
- Advanced button shows state (▶/▼)
- Selected values in dropdowns
- Search text visible in input
- Date values in date inputs

#### Filter Results
- Todo counts update: "Overdue (X)", "Pending (X)", "Completed (X)"
- Sections auto-hide if empty
- "No results" state if all filtered out

### Search Examples

#### Basic Search
```
Search: "meeting"
→ Finds all todos/subtasks containing "meeting"
```

#### Search + Priority
```
Search: "project"
Priority: High
→ Only high-priority items about projects
```

#### Date Range Filter
```
Date From: 2025-11-01
Date To: 2025-11-07
→ Shows this week's todos only
```

#### Complex Combination
```
Search: "report"
Priority: High
Tag: Work
Completion: Incomplete
Date: This week
→ High-priority incomplete work reports due this week
```

#### Tag + Completion
```
Tag: Personal
Completion: Completed
→ Review all completed personal tasks
```

### Filter Tips

#### Efficiency
- ⚡ Save frequent combinations as presets
- ⚡ Use "Clear All" for quick reset
- ⚡ Combine search with tags for precise results
- ⚡ Date ranges great for weekly planning

#### Organization
- 📋 Create presets for daily workflows
- 📋 "Today's High Priority" preset
- 📋 "This Week Work Items" preset
- 📋 "Overdue Personal Tasks" preset

#### Analysis
- 📊 Use completion filter + tags to review category progress
- 📊 Date ranges to analyze past performance
- 📊 Search specific terms to track recurring topics

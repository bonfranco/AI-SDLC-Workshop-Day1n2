# 11. Export & Import

### What It Does
Backup your todos, share them between devices, or analyze data in spreadsheets with JSON and CSV export formats.

### Export Functionality

#### How to Export

**JSON Export**:
1. Click **"Export JSON"** button (green, top-right)
2. File downloads automatically
3. Filename format: `todos-YYYY-MM-DD.json`
4. Example: `todos-2025-11-02.json`

**CSV Export**:
1. Click **"Export CSV"** button (dark green, top-right)
2. File downloads automatically
3. Filename format: `todos-YYYY-MM-DD.csv`
4. Example: `todos-2025-11-02.csv`

#### Export Formats Comparison

**JSON Export**
- ✅ Complete data with all fields
- ✅ Nested structure preserved
- ✅ Can be re-imported
- ✅ Includes metadata
- ✅ Best for backup and data transfer
- ✅ Human-readable format

**Fields Included**:
```json
{
  "id": 1,
  "title": "Sample Todo",
  "completed": false,
  "due_date": "2025-11-10T14:00",
  "priority": "high",
  "is_recurring": true,
  "recurrence_pattern": "weekly",
  "reminder_minutes": 60,
  "created_at": "2025-11-02T10:30:00"
}
```

**CSV Export**
- ✅ Spreadsheet-friendly format
- ✅ Opens in Excel, Google Sheets, Numbers
- ✅ Good for analysis and reporting
- ✅ Column-based layout
- ✅ Easy data visualization
- ❌ Cannot be re-imported

**Columns**:
```csv
ID,Title,Completed,Due Date,Priority,Recurring,Pattern,Reminder
1,"Sample Todo",false,"2025-11-10T14:00","high",true,"weekly",60
```

### Import Functionality

#### How to Import
1. Click **"Import"** button (blue, top-right)
2. File picker opens
3. Select JSON file (from previous export)
4. Click "Open"
5. File is validated and processed

#### Import Process
1. **File validation**: Checks JSON format
2. **Data validation**: Verifies todo structure
3. **Creation**: Creates new todos
4. **Refresh**: Todo list updates automatically
5. **Confirmation**: Success message displays

#### Import Behavior

**What Happens**:
- ✅ Creates NEW todos (doesn't update existing)
- ✅ Preserves all todo properties
- ✅ Assigns new IDs
- ✅ Links to current user
- ✅ Validates data before import

**What's Preserved**:
- Todo titles
- Completion status
- Due dates
- Priority levels
- Recurrence settings
- Reminder timings
- Creation timestamps

**What's NOT Imported**:
- ❌ Original todo IDs (new IDs assigned)
- ❌ User associations (links to importing user)
- ❌ Tags (must be recreated/reassigned)
- ❌ Subtasks (if not in export format)

#### Import Validation

**Success Conditions**:
- Valid JSON format
- Correct data structure
- Required fields present
- Valid enum values (priority, pattern)

**Error Conditions**:
- Invalid JSON syntax
- Missing required fields
- Corrupted file
- Wrong file format

**Error Messages**:
```
✗ "Failed to import todos. Please check the file format."
✗ "Invalid JSON format"
✗ "Failed to import todos" (network error)
```

**Success Message**:
```
✓ "Successfully imported X todos"
```

### Use Cases

#### Backup Strategy
1. **Daily**: Export JSON at end of day
2. **Weekly**: Export CSV for review
3. **Monthly**: Archive JSON exports
4. **Before major changes**: Safety backup

#### Data Transfer
1. Export JSON on device A
2. Send file to device B (email, cloud, USB)
3. Import JSON on device B
4. Continue working with same todos

#### Analysis & Reporting
1. Export CSV weekly/monthly
2. Open in spreadsheet application
3. Create pivot tables
4. Analyze completion rates
5. Track priorities distribution
6. Review time management

#### Collaboration
1. Export todos as JSON
2. Share with team member
3. They import to their account
4. Maintain separate but synchronized lists

### Tips & Best Practices

#### Export Tips
- 📅 Export regularly (recommended: weekly)
- 📅 Use JSON for complete backups
- 📅 Use CSV for viewing in spreadsheets
- 📅 Keep exports organized by date
- 📅 Store in cloud storage for safety

#### Import Tips
- ⚠️ Only import files from this app
- ⚠️ Verify file before importing
- ⚠️ Import creates duplicates (doesn't merge)
- ⚠️ Review after import to verify data
- ⚠️ Delete test imports if needed

#### File Management
- 📁 Create export folder structure:
  ```
  /TodoBackups
    /2025
      /11-November
        todos-2025-11-02.json
        todos-2025-11-09.json
  ```
- 📁 Name files descriptively if needed
- 📁 Compress old exports (zip)
- 📁 Delete outdated backups

### Technical Details

#### Export API
- **Endpoint**: `/api/todos/export?format={json|csv}`
- **Method**: GET
- **Response**: File download
- **MIME types**:
  - JSON: `application/json`
  - CSV: `text/csv`

#### Import API
- **Endpoint**: `/api/todos/import`
- **Method**: POST
- **Content-Type**: `application/json`
- **Body**: Array of todo objects
- **Response**: Success message with count

#### File Size Considerations
- Small list (< 100 todos): < 50KB
- Medium list (100-500 todos): 50-250KB
- Large list (> 500 todos): > 250KB
- No file size limit enforced

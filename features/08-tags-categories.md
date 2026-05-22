# 8. Tags & Categories

### What It Does
Organize todos with custom color-coded labels for better categorization and filtering.

### Managing Tags

#### Creating Tags
1. Click **"+ Manage Tags"** button (near todo form)
2. In the modal:
   - Enter tag name in text field
   - Select color using color picker or enter hex code
   - Click **"Create Tag"**
3. Tag appears in your tag list immediately

#### Editing Tags
1. Open tag management modal
2. Click **"Edit"** button next to any tag
3. Modify name and/or color
4. Click **"Update"**
5. Changes reflect on all todos using that tag

#### Deleting Tags
1. Open tag management modal
2. Click **"Delete"** button next to tag
3. Confirm deletion
4. Tag removed from all todos (CASCADE delete)

### Using Tags on Todos

#### When Creating Todos
1. View tags section below todo form (if tags exist)
2. Click tag pills to select/deselect
3. Selected tags show:
   - ✓ Checkmark
   - Colored background
   - White text
4. Unselected tags show:
   - No checkmark
   - White/gray background
   - Gray border
5. Multiple tags can be selected

#### When Editing Todos
1. Click **"Edit"** on a todo
2. Tag selection appears in edit modal
3. Toggle tags on/off
4. Click **"Update"** to save

### Filtering by Tags
1. Use **"All Tags"** dropdown in filter section
2. Select a tag to show only todos with that tag
3. Tag filter combines with other filters (search, priority, dates)
4. Select "All Tags" to clear tag filter

### Visual Display
- Tags appear as **colored pills** on todos
- Tag names in **white text** on colored background
- Rounded full shape for visual appeal
- Positioned after priority and recurrence badges
- Visible in all sections (Overdue, Pending, Completed)

### Tag Features
- 🔐 User-specific (each user has their own tags)
- 📌 Unique names per user (no duplicate names)
- 🔄 CASCADE delete (removing tag updates all todos)
- ⚡ Real-time updates across all todos
- 🎨 Custom colors with hex code support
- 📱 Responsive display (wraps on mobile)

### Tag Management Modal
- **Default color**: `#3B82F6` (blue)
- **Color picker**: Standard HTML color input
- **Hex input**: Manual entry supported
- **Tag list**: Shows all your tags with actions
- **Dark mode**: Fully supported

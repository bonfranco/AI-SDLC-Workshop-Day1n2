# 14. Dark Mode

### What It Does
Automatically applies a dark color scheme based on your system preferences for comfortable viewing in low-light environments.

### How It Works

#### Automatic Detection
- Detects system dark mode preference
- Uses CSS media query: `prefers-color-scheme: dark`
- No manual toggle needed
- Changes apply instantly when system setting changes

#### System Integration
- **macOS**: Follows System Preferences → General → Appearance
- **Windows**: Follows Settings → Personalization → Colors
- **Linux**: Follows desktop environment theme settings
- **Mobile**: Follows system theme settings

### Visual Changes

#### Background Colors
**Light Mode**:
- Main background: Blue-to-indigo gradient
- Card backgrounds: White
- Input backgrounds: White

**Dark Mode**:
- Main background: Gray-to-dark-gray gradient
- Card backgrounds: Dark gray (#1F2937, #374151)
- Input backgrounds: Dark gray

#### Text Colors
**Light Mode**:
- Primary text: Dark gray/black
- Secondary text: Medium gray
- Muted text: Light gray

**Dark Mode**:
- Primary text: White
- Secondary text: Light gray
- Muted text: Medium gray

#### Component Adaptations

**Priority Badges**:
- Light mode: Bright backgrounds, dark text
- Dark mode: Muted backgrounds, bright text
- Maintains color distinction (red/yellow/blue)

**Tag Pills**:
- Custom colors preserved in both modes
- White text for visibility
- Slight transparency adjustments

**Buttons**:
- Light mode: Saturated colors
- Dark mode: Slightly muted for eye comfort
- Hover states adjusted

**Borders**:
- Light mode: Light gray borders
- Dark mode: Medium gray borders
- Increased contrast for visibility

**Shadows**:
- Light mode: Subtle gray shadows
- Dark mode: Deeper shadows for depth
- Adjusted opacity

### Where Dark Mode Applies

#### Main Application
- ✅ Todo list page
- ✅ Todo form (all inputs)
- ✅ Priority dropdowns
- ✅ Date-time pickers
- ✅ Search bar
- ✅ Filter controls

#### Modals & Dialogs
- ✅ Edit todo modal
- ✅ Tag management modal
- ✅ Template modal
- ✅ Save filter modal
- ✅ Save template modal

#### Components
- ✅ Buttons (all types)
- ✅ Input fields
- ✅ Dropdown menus
- ✅ Checkboxes
- ✅ Progress bars
- ✅ Badges and pills
- ✅ Section headers

#### Sections
- ✅ Overdue section (red background adjusted)
- ✅ Pending section
- ✅ Completed section
- ✅ Advanced filters panel

### Color Palette

#### Light Mode
```
Backgrounds:
- Gradient: from-blue-50 to-indigo-100
- Cards: white
- Inputs: white
- Filters: gray-50

Text:
- Primary: gray-800
- Secondary: gray-600
- Muted: gray-500

Accents:
- Blue: #3B82F6
- Red: #EF4444
- Yellow: #F59E0B
- Green: #10B981
```

#### Dark Mode
```
Backgrounds:
- Gradient: from-gray-900 to-gray-800
- Cards: gray-800
- Inputs: gray-700
- Filters: gray-700/50

Text:
- Primary: white
- Secondary: gray-400
- Muted: gray-500

Accents:
- Blue: #60A5FA
- Red: #F87171
- Yellow: #FBBF24
- Green: #34D399
```

### Accessibility

#### Contrast Ratios
- Text meets WCAG AA standards
- Badges and tags readable in both modes
- Focus states visible
- Hover states distinct

#### Visual Comfort
- Reduced brightness in dark mode
- Less eye strain in low light
- Smooth transitions between modes
- No harsh white backgrounds

### Testing Dark Mode

#### Enable Dark Mode
**macOS**:
1. System Preferences → General
2. Appearance → Dark
3. Refresh browser if needed

**Windows**:
1. Settings → Personalization → Colors
2. Choose your color → Dark
3. Refresh browser if needed

**Manual Testing**:
1. Open browser DevTools (F12)
2. Toggle device toolbar
3. Click ⋮ → More tools → Rendering
4. Emulate CSS media: `prefers-color-scheme: dark`

### Tips

#### For Best Experience
- Use dark mode in low-light environments
- Use light mode in bright environments
- Let system auto-switch based on time of day
- Adjust screen brightness accordingly

#### Customization (Future)
- Currently automatic only
- Manual toggle could be added
- Per-user preference storage possible
- Override system setting option available

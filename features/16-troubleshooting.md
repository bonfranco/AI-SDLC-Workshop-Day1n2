# 16. Troubleshooting

## Notifications Not Working

### Symptoms
- No browser notifications appearing
- Reminder badge shows but no notification
- "Enable Notifications" button stays visible

### Solutions

**1. Check Browser Permissions**
- Chrome: Settings → Privacy and security → Site settings → Notifications
- Firefox: Settings → Privacy & Security → Permissions → Notifications
- Safari: Preferences → Websites → Notifications

**2. Verify Requirements**
- Click "Enable Notifications" button
- Grant permission when prompted
- Todo has due date set
- Reminder timing is set
- Reminder time hasn't passed yet

**3. Browser-Specific Issues**
- Try different browser
- Update browser to latest version
- Check if notifications work on other sites
- Restart browser

**4. System-Level Issues (macOS)**
- System Preferences → Notifications
- Find browser in list
- Enable "Allow notifications from [Browser]"

## Todos Not Saving

### Symptoms
- "Add" button doesn't work
- Todo disappears after adding
- Changes not persisting
- Error messages

### Solutions

**1. Check Required Fields**
- Title is not empty
- Title is not just whitespace
- For recurring: due date is set
- For reminders: due date is set

**2. Verify Due Date**
- Due date is in the future (Singapore time)
- At least 1 minute from now
- Valid date format (YYYY-MM-DDTHH:mm)

**3. Network Issues**
- Check internet connection
- Check if API is responding
- Look for error in browser console (F12)
- Try refreshing page

**4. Browser Issues**
- Clear browser cache
- Try incognito/private mode
- Disable browser extensions
- Try different browser

## Import Failing

### Symptoms
- "Failed to import todos" error
- Import button doesn't work
- File not accepted
- Todos not appearing after import

### Solutions

**1. File Format Issues**
- Ensure file is JSON format
- Verify file extension is .json
- File was exported from this app
- File not corrupted or modified

**2. Validate JSON**
- Open file in text editor
- Check for JSON syntax errors
- Use JSON validator online
- Try exporting fresh file and re-importing

**3. File Size**
- Very large files may time out
- Split into smaller imports if needed
- Check network stability

**4. Test Import**
- Export current todos as test
- Immediately try to import
- If works: original file is corrupted
- If fails: browser or API issue

## Tags Not Showing

### Symptoms
- Tags created but not visible
- Tags not appearing on todos
- Tag filter not working
- Tag modal not opening

### Solutions

**1. Verify Tag Creation**
- Open tag management modal
- Check if tag exists in list
- Ensure tag has name
- Verify color is set

**2. Check Todo Association**
- Edit todo
- Verify tag is selected (checkmark visible)
- Click "Update" to save
- Refresh page

**3. Filter Conflicts**
- Check if tag filter is active
- Clear all filters
- Ensure completion filter not hiding todos
- Check search query

**4. Refresh Data**
- Reload page (F5)
- Clear browser cache
- Log out and log back in

## Search Not Finding Results

### Symptoms
- Search returns no results
- Expected todos not appearing
- Search seems broken

### Solutions

**1. Check Search Input**
- Spelling is correct
- Try partial search (fewer letters)
- Search is case-insensitive
- Try searching subtask content

**2. Verify Other Filters**
- Clear all filters except search
- Check if priority filter is active
- Check if tag filter is active
- Check if completion filter is hiding results

**3. Confirm Todo Exists**
- Clear search
- Manually browse list
- Verify todo actually exists
- Check if in Completed section

**4. Test Search**
- Test 1: Search for single letter ("a")
- Test 2: Search for common word ("meeting")
- Test 3: Clear search and verify todos appear
- Test 4: Search in subtask content

## Calendar Not Loading

### Symptoms
- Calendar page is blank
- Todos not appearing on calendar
- Navigation not working
- 404 error

### Solutions

**1. Check URL**
- Ensure URL is `/calendar`
- Click "Calendar" button from main page
- Verify route exists

**2. Verify Data**
- Return to main page
- Check if todos have due dates
- Only todos with due dates appear on calendar
- Verify dates are valid

**3. Browser Issues**
- Refresh page (F5)
- Clear cache
- Try different browser
- Check JavaScript is enabled

## Dark Mode Issues

### Symptoms
- Dark mode not activating
- Colors look wrong
- Text not readable
- Stuck in one mode

### Solutions

**1. Check System Settings**
- macOS: System Preferences → General → Appearance → Dark
- Windows: Settings → Personalization → Colors → Dark
- Linux: Desktop environment theme settings

**2. Browser Detection**
- Use DevTools to test (F12)
- Rendering → Emulate CSS media
- Toggle dark/light
- Verify changes apply

**3. Cache Issues**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Try incognito mode

## Performance Issues

### Symptoms
- App is slow
- Lag when typing
- Slow filter updates
- Delays in todo creation

### Solutions

**1. Data Size**
- Large number of todos (> 500) may slow down
- Export and archive old todos
- Delete completed todos
- Use filters to reduce visible items

**2. Browser Performance**
- Close unused tabs
- Restart browser
- Update to latest browser version
- Check system resources

**3. Network Issues**
- Check internet speed
- Verify API response times
- Check browser console for errors
- Try different network

## Login/Authentication Issues

### Symptoms
- Cannot register
- Cannot login
- Passkey not working
- Session expiring

### Solutions

**1. Browser Support**
- Use modern browser (Chrome, Firefox, Safari, Edge)
- Update browser to latest version
- Enable WebAuthn support

**2. Device Support**
- Ensure device has biometric capability
- Check security key is working
- Verify passkey is saved
- Try different authentication method

**3. Session Issues**
- Clear cookies
- Log out and log back in
- Try incognito mode
- Register new account to test

## General Troubleshooting Steps

### When Something Doesn't Work

**Step 1: Basic Checks**
- Refresh page (F5)
- Check internet connection
- Verify you're logged in
- Check browser console for errors (F12)

**Step 2: Clear State**
- Clear filters
- Clear search
- Close all modals
- Return to main page

**Step 3: Browser Reset**
- Clear browser cache
- Clear cookies (may need to re-login)
- Restart browser
- Try incognito/private mode

**Step 4: Data Verification**
- Export current todos as backup
- Check if data is intact
- Verify database operations working
- Test with new todo

**Step 5: Escalation**
- Try different browser
- Try different device
- Check app status/server
- Report bug with details

### Collecting Debug Information

When reporting issues, include:
- Browser name and version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Console errors (F12 → Console tab)
- Network errors (F12 → Network tab)
- Screenshots if helpful

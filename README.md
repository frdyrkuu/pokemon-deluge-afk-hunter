# Legendary Hunter Browser Extension

## Overview

Legendary Hunter is a browser extension designed to automate the hunting process for specific Pokemon encounters in web-based Pokemon games. It continuously moves through the game map until it detects a Pokemon that matches your configured filters, then stops and alerts you with a sound notification.

## Features

- **Automated Movement**: Automatically navigates through the game map by selecting valid movement options
- **Rarity Filtering**: Target Legendary and Paradox Pokemon encounters
- **Type Filtering**: Hunt for Pokemon with specific type prefixes (Shiny, Metallic, Ghostly, Dark, Shadow, Mirage, Chrome, Negative, Retro)
- **Real-time Detection**: Monitors game elements to detect encounters and Pokemon types
- **Manual Override**: Stop the automation at any time using the ESC key
- **Persistent Settings**: Filter preferences are saved in browser session storage
- **Audio Alerts**: Plays a battle sound when a matching Pokemon is found

## Installation

### Chrome/Edge (Manifest V3)
1. Download or clone this repository
2. Open your browser and navigate to the extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension should now appear in your extensions list

### Firefox
Firefox uses Manifest V2, so you would need to modify the manifest.json file:
- Change `"manifest_version": 3` to `"manifest_version": 2`
- Replace `"action"` with `"browser_action"`
- Update permissions syntax if needed

## Usage

1. **Open the Game**: Navigate to your Pokemon game website
2. **Configure Filters**:
   - Click the extension icon in your browser toolbar
   - Select the Pokemon types you want to hunt (Shiny, Metallic, etc.)
   - Choose rarity levels (Legendary, Paradox)
   - Use "Select all" to quickly toggle all filters
3. **Start Hunting**:
   - Click "Start Hunt" to begin automation
   - The extension will automatically move through the map
4. **Stop Hunting**:
   - Click "Stop" in the popup
   - Or press the ESC key on your keyboard
5. **Monitor Status**: The status indicator shows current state (Ready/Hunting/Stopped)

## How It Works

### Detection Mechanism
The extension monitors specific DOM elements in the game:
- `#mapcontext`: Used to detect rarity information
- `#dexy`: Used to detect Pokemon type prefixes
- `#hp`: Used to detect when an encounter occurs
- `[data-dir]`: Movement buttons on the map

### Automation Loop
1. Checks if currently in a Pokemon encounter
2. If in encounter, analyzes the Pokemon's rarity and type
3. If it matches active filters, stops and plays alert sound
4. If no match, continues to next step
5. If not in encounter, selects a random valid movement
6. Waits 600ms, then repeats

### Filter Logic
- **Rarity**: Searches for "legendary" or "paradox" text in map context
- **Type**: Searches for type keywords in the Pokemon display element
- Only active filters are checked during encounters

## Permissions

The extension requires the following permissions:
- `activeTab`: To interact with the current tab
- `scripting`: To inject content scripts
- `web_accessible_resources`: To access the battle sound file

## Files Structure

```
legendary-hunter/
├── manifest.json      # Extension configuration
├── popup.html         # Extension popup interface
├── popup.js           # Popup functionality and messaging
├── content.js         # Main automation logic
└── pokemon_battle.mp3 # Alert sound (not included)
```

## Configuration

### Adding Custom Sound
Replace `pokemon_battle.mp3` with your preferred alert sound. Make sure to update the manifest.json `web_accessible_resources` accordingly.

### Adjusting Timing
Modify the delay in `content.js` (currently 600ms) to change movement speed. Be careful not to violate game rate limits.

## Troubleshooting

### Extension Not Working
- Ensure you're on a compatible Pokemon game website
- Check that the game uses the expected DOM element IDs
- Verify all permissions are granted

### Filters Not Applying
- Refresh the page after changing filters
- Check browser console for error messages
- Ensure session storage is not disabled

### Movement Issues
- The extension only clicks unblocked movement buttons
- If no valid moves are found, the loop will stop
- Check game state and map layout

## Important Notes

### Game Compatibility
This extension is designed for specific web-based Pokemon games that use particular DOM structures. It may not work with all games or websites.

### Terms of Service
Automated tools may violate the terms of service of some games. Use at your own risk and ensure compliance with the game's rules.

### Performance
The extension runs continuously while active, which may impact browser performance. Monitor system resources during extended use.

## Development

### Building
No build process required - the extension runs directly from source files.

### Testing
Test on a local development server or staging environment before using in live games.

### Contributing
1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is provided as-is for educational purposes. Check individual game licenses for automation restrictions.
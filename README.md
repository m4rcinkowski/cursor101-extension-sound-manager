# Sound Tab Manager

A browser extension for Chrome and Opera that helps you manage tabs that are producing sound.

## Features

- Displays a list of all tabs currently producing sound
- Shows "Everything's quiet" when no tabs are making sound
- Allows you to mute/unmute individual tabs with a single click
- Click on a tab in the list to switch to it

## Installation

### Chrome

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the directory containing this extension
5. The Sound Tab Manager icon should now appear in your browser toolbar

### Opera

1. Download or clone this repository
2. Open Opera and navigate to `opera://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the directory containing this extension
5. The Sound Tab Manager icon should now appear in your browser toolbar

## Usage

1. Click on the Sound Tab Manager icon in your browser toolbar
2. A popup will display all tabs that are currently producing sound
3. Click the mute/unmute button next to a tab to toggle its sound
4. Click on a tab in the list to switch to it

## Technical Details

This extension uses the browser's native APIs to detect and manage sound-producing tabs. It includes an abstraction layer to handle any differences between Chrome and Opera APIs.

## License

MIT 
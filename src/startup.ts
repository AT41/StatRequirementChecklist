import { PLUGIN_WINDOW_CLASSIFICATION } from './const';
import {StatWindow} from './window/StatWindow/StatWindow';

function onClickMenuItem()
{
	ui.closeWindows(PLUGIN_WINDOW_CLASSIFICATION);
	StatWindow.createWindow();
	//TODO Must check if ui available before using ui interface
	//TODO Add imperial / metric conversions using formatString
}

export function startup()
{
	// Write code here that should happen on startup of the plugin.
	// Game state is not mutable in the main function

	StatWindow.setHooks();
	StatWindow.createWindow();
	// Register a menu item under the map icon:
	if (typeof ui !== "undefined")
	{
		ui.registerMenuItem("My plugin", () => onClickMenuItem());
	}
}
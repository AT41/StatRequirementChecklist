import { PLUGIN_WINDOW_CLASSIFICATION } from './const';
import {StatWindow} from './window/StatWindow/StatWindow';

function onClickMenuItem()
{
	ui.closeWindows(PLUGIN_WINDOW_CLASSIFICATION);
	StatWindow.createWindow();
}

export function startup()
{
	StatWindow.setHooks();
	// Register a menu item under the map icon:
	if (typeof ui !== "undefined")
	{
		ui.registerMenuItem("Ride Stat Requirements", () => onClickMenuItem());
	}
}
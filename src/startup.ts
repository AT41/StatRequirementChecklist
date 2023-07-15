import { PLUGIN_WINDOW_CLASSIFICATION } from './const';
import {StatWindow} from './window/StatWindow';

function onClickMenuItem()
{
	ui.closeWindows(PLUGIN_WINDOW_CLASSIFICATION);
	new StatWindow();
	//On ridecreate, ridedemolish open window, refresh global rides
	//Use context.sharedStorage for plugin options
	//TODO Must check if ui available before using ui interface
}

export function startup()
{
	// Write code here that should happen on startup of the plugin.
	// Game state is not mutable in the main function

	
	// Register a menu item under the map icon:
	if (typeof ui !== "undefined")
	{
		ui.registerMenuItem("My plugin", () => onClickMenuItem());
	}
	onClickMenuItem();
}
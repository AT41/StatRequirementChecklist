import {StatWindow} from './window/StatWindow';

function onClickMenuItem()
{
	for (let i = 0; i < 99; i++) {
		if (ui.getWindow(i)) {
			console.log(ui.getWindow(i).classification);
		}
	}
	new StatWindow();
	//On ridecreate, ridedemolish open window, refresh global rides
	//Use context.sharedStorage for plugin options
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
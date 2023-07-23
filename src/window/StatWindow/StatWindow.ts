import { Logic } from "../../logic/logic";
import { RideRequirementWidgets } from "./RideRequirementWidgets";
import { OptionWindow } from "../OptionWindow/OptionWindow";
import { getPluginWindow } from "../../sharedService/sharedService";
import { RideType } from "../../data/types";
import { ChecklistWidgets } from "./ChecklistWidgets";
import { RideSelectWidgets } from "./RideSelectWidgets";


//Making all of these windows singletons for now, so updating is easier
export class StatWindow {
    private static window: Window;
    private static hooks: IDisposable[] = [];
    private static readonly TRACK_DESIGN_FLAG = 0b00100000;
    private static readonly Y_START = 25;
    private static readonly WIDTH = 220;
    private static readonly BOX_HEIGHT = 240;

    public static createWindow(): Window {
        let windowExists = getPluginWindow();
        if (windowExists) {
            this.window = windowExists;
            return this.window;
        }
        this.window = ui.openWindow({
            classification: "Stat Requirement Window",
            width: 230,
            height: 300,
            title: "Ride Stat Requirements",
            tabs: [
                {
                    image: 'hide_vehicles',
                    widgets: this.createWidgets()
                },
                {
                    image: {
                        frameBase: 5201,
                        frameCount: 4,
                        frameDuration: 4
                    },
                    widgets: OptionWindow.createWidgets()
                },
            ],
            onTabChange: () => {
                OptionWindow.updateWidgets();
                RideSelectWidgets.reloadDropdownWidgetSelection();
            }
        });
        RideSelectWidgets.updateDropdownWidgetItems();
        OptionWindow.updateWidgets();
        return this.window;
    }

    public static setHooks() {
        if (this.hooks) {
            this.hooks.forEach(hook => hook.dispose());
            this.hooks = [];
        }
        if (typeof ui === "undefined") {
            return;
        }
        let currentRideId = -1;
        OptionWindow.loadData();
        this.hooks.push(context.subscribe('action.execute', (e) => {
            let data = OptionWindow.data;
            if (((e.args as RideCreateArgs).flags??0 & this.TRACK_DESIGN_FLAG) > 0)
                return;
            switch (e.action) {
                case 'ridecreate': 
                case 'trackplace':
                    if (data.options.openWhenCreatingRide && !getPluginWindow()) {
                        this.createWindow();
                    }
                    RideSelectWidgets.updateDropdownWidgetItems();
                    let rideId = (e.args as TrackPlaceArgs).ride || (e.result as RideCreateActionResult).ride;
                    if (data.options.autoChangeRideSelection && currentRideId !== rideId) {
                        currentRideId = rideId??0;
                        const rideDropdownIndex = (this.window.findWidget("rideSelectWidgetId") as DropdownWidget).items.map(idAndName => idAndName.match(/^\d+/)?.[0]).indexOf(currentRideId.toString());
                        RideSelectWidgets.updateRideSelectDropdown(rideDropdownIndex);
                    }
                    break;
                case 'ridedemolish':
                    if (data.options.closeWhenDeletingRide) {
                        getPluginWindow()?.close();
                    }
                    break;
            }
        }));
        this.hooks.push(context.subscribe('ride.ratings.calculate', (e) => {
            if (OptionWindow.data.options.autoUpdateChecklistSelection && e.rideId === RideSelectWidgets.windowState.currentSelectedRideId && getPluginWindow()) {                
                let requirements = Logic.getRequirements(map.getRide(e.rideId).type);
                if (!requirements)
                    return;
                const checklistYEnd = ChecklistWidgets.updateWidgets(requirements);
                RideRequirementWidgets.updateYStart(checklistYEnd + 5);
            }
        }));
    }

    private static createWidgets(): WidgetDesc[] {
        let widgets: WidgetDesc[] = [];
        widgets.push({
            type: "groupbox",
            x: 5,
            y: this.Y_START + 25,
            width: this.WIDTH,
            height: this.BOX_HEIGHT,
            name: "ride_selection",
            text: "Ride Selection"
        });
        widgets = widgets.concat(RideSelectWidgets.createWidgets(15, 65));
        widgets = widgets.concat(ChecklistWidgets.createWidgets(15, 110));
        widgets = widgets.concat(RideRequirementWidgets.createWidgets(15, 200));
        return widgets;
    }
}
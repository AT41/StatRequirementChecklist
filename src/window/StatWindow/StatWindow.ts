import { Logic } from "../../logic/logic";
import { RideRequirementWidgets } from "./RideRequirementWidgets";
import { OptionWindow } from "../OptionWindow/OptionWindow";
import { getPluginWindow } from "../../sharedService/sharedService";
import { ChecklistWidgets } from "./ChecklistWidgets";
import { RideSelectWidgets } from "./RideSelectWidgets";
import { PLUGIN_WINDOW_CLASSIFICATION } from "../../const";


//Making all of these windows singletons for now, so updating is easier
export class StatWindow {
    private static readonly TRACK_DESIGN_FLAG = 0b00100000;
    private static readonly RIDE_EDIT_CLASSIFICATION = 13;
    private static readonly Y_START = 25;
    private static readonly WIDTH = 220;
    private static readonly BOX_HEIGHT = 240;

    private static window: Window;
    private static hooks: IDisposable[] = [];

    public static createWindow(): Window {
        let windowExists = getPluginWindow();
        if (windowExists) {
            this.window = windowExists;
            return this.window;
        }
        let rideEditWindow: Window | null = null;
        for (let i = 0; i < ui.windows; i++) {
            const tempWindow = ui.getWindow(i);
            if (tempWindow.classification === this.RIDE_EDIT_CLASSIFICATION) {
                rideEditWindow = tempWindow;
                break;
            }
        }

        this.window = ui.openWindow({
            classification: PLUGIN_WINDOW_CLASSIFICATION,
            width: 230,
            height: 300,
            x: rideEditWindow ? (rideEditWindow.x + rideEditWindow.width) : undefined,
            y: rideEditWindow ? rideEditWindow.y : undefined,
            title: "Ride Stat Requirements",
            colours: [26, 26],
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
            },
            onClose: () => {
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
        OptionWindow.loadData();
        this.hooks.push(context.subscribe('action.execute', (e) => {
            let data = OptionWindow.data;
            let createOrTrackPlace: "ridecreate" | "trackplace" = "trackplace";
            switch (e.action) {
                //@ts-ignore
                case 'ridecreate': 
                    createOrTrackPlace = "ridecreate";
                case 'trackplace':
                    const isTrackDesign = ((e.args as RideCreateArgs | TrackPlaceArgs).flags??0 & this.TRACK_DESIGN_FLAG) > 0;
                    const isRidePreview = (e.args as TrackPlaceArgs).isFromTrackDesign??false;
                    if (isTrackDesign && (isRidePreview && !data.options.openOnPrebuildSelect || !isRidePreview && !data.options.openWhenModifyingRide)) {
                        return;
                    }
                    let rideId: number | undefined = (e.args as TrackPlaceArgs).ride;
                    if (rideId === undefined)
                        rideId = (e.result as RideCreateActionResult).ride;
                    let rideType: number = (e.args as TrackPlaceArgs | RideCreateArgs).rideType;
                    const currentRideId = RideSelectWidgets.getCurrentRideId();
                    const currentRideType = RideSelectWidgets.getCurrentRideType();
                    if ((createOrTrackPlace === "ridecreate" && data.options.openWhenCreatingRide || createOrTrackPlace === "trackplace" && data.options.openWhenModifyingRide) 
                        && (rideId !== currentRideId || rideType !== currentRideType)
                        && !getPluginWindow()) {
                        this.createWindow();
                    }
                    RideSelectWidgets.updateDropdownWidgetItems();
                    if (data.options.autoChangeRideSelection && (rideId !== currentRideId || rideType !== currentRideType)) {
                        const rideSelectWidget = (this.window.findWidget("rideSelectWidgetId") as DropdownWidget);
                        if (!rideSelectWidget)
                            break;
                        let rideDropdownIndex = rideSelectWidget.items.map(idAndName => idAndName.match(/^\d+/)?.[0]).indexOf((rideId??0).toString());
                        rideDropdownIndex = rideDropdownIndex === -1 ? 0 : rideDropdownIndex;
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
            if (OptionWindow.data.options.autoUpdateChecklistSelection && e.rideId === RideSelectWidgets.getCurrentRideId() && getPluginWindow()) {                
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
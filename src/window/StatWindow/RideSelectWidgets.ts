import { Logic } from "../../logic/logic";
import { getPluginWindow } from "../../sharedService/sharedService";
import { ChecklistWidgets } from "./ChecklistWidgets";
import { RideRequirementWidgets } from "./RideRequirementWidgets";

interface RideSelectionState {
    rideSelectWidgetIndex: number,
    researchRideSelectWidgetIndex: number,
    currentSelectedRideId: number
}
export class RideSelectWidgets {
    private static readonly WIDTH = 220;
    private static readonly DROPDOWN_HEIGHT = 15;

    private static xStart = 0;
    private static yStart = 0;
    private static widgets: WidgetDesc[];

    private static _windowState: RideSelectionState = {
        rideSelectWidgetIndex: 0,
        researchRideSelectWidgetIndex: 0,
        currentSelectedRideId: -1
    }
    
    public static get windowState(): RideSelectionState {
        return this._windowState;
    }

    public static createWidgets(xStart: number, yStart: number): WidgetDesc[] {
        if (this.widgets) {
            return this.widgets;
        }
        this.xStart = xStart;
        this.yStart = yStart;
        this.widgets = [];
        this.widgets.push({
            type: "dropdown",
            items: [],
            selectedIndex: -1,
            x: this.xStart,
            y: this.yStart,
            width: this.WIDTH - 20,
            height: this.DROPDOWN_HEIGHT,
            name: "rideSelectWidgetId",
            onChange: (i) => {
                this.updateRideSelectDropdown(i);
            }
        });
        this.widgets.push({
            type: "dropdown",
            x: this.xStart,
            y: this.yStart + 20,
            width: this.WIDTH - 20,
            height: this.DROPDOWN_HEIGHT,
            name: "researchRideSelectWidgetId",
            onChange: (i) => {
                this.updateResearchRideSelectDropdown(i);
            }
        });
        return this.widgets;
    }

    public static updateDropdownWidgetItems(): void {
        let window = getPluginWindow();
        if (!window) 
            return;

        (window.findWidget("rideSelectWidgetId") as DropdownWidget).items = 
            [
                "---",
                ...map.rides.filter(ride => ride.classification === "ride").map(function (ride) {
                    return [ride.id, ride.name].join(" - ");
                })
            ];
        (window.findWidget("researchRideSelectWidgetId") as DropdownWidget).items = 
            [
                "---",
                ...park.research.inventedItems
                    .filter(item => item.type === "ride")
                    .map(item => {
                        if (item.type === "ride") {
                            return Logic.typeToName(item.rideType);
                        }
                        else return "";
                    })
                    .filter(name => name != "")
                    .sort()
            ];
    }

    public static getCurrentRideId(): number | undefined {
        let window = getPluginWindow();
        if (!window)
            return;
        const selectedItem = (window.findWidget("rideSelectWidgetId") as DropdownWidget).items[this.windowState.rideSelectWidgetIndex].match(/^\d+/)?.[0];
        return selectedItem ? parseInt(selectedItem) : undefined;
    }

    public static updateRideSelectDropdown(index: number): void {
        let window = getPluginWindow();
        if (!window) 
            return;
        console.log("updating ride select");
        this.windowState.currentSelectedRideId = -1;
        let widget = window.findWidget("rideSelectWidgetId") as DropdownWidget;
        if (!widget) 
            return;
        if (index !== 0) {
            let secondaryWidget = window.findWidget("researchRideSelectWidgetId") as DropdownWidget;
            secondaryWidget.selectedIndex = 0;
            this._windowState.researchRideSelectWidgetIndex = 0;
            const currentRideId = parseInt(widget.items[index].match(/^\d+/)?.[0]??"-1");
            this.windowState.currentSelectedRideId = currentRideId;
            let requirements = Logic.getRequirements(map.getRide(currentRideId) ? map.getRide(currentRideId).type : -1);
            
            const newY = ChecklistWidgets.updateWidgets(undefined, undefined);
            RideRequirementWidgets.updateWidgets(window, requirements);
            RideRequirementWidgets.updateYStart(newY);
        }
        widget.selectedIndex = index;
        this.windowState.rideSelectWidgetIndex = index;
    }

    public static updateResearchRideSelectDropdown(index: number): void {
        let window = getPluginWindow();
        if (!window)
            return;
        let widget = window.findWidget("researchRideSelectWidgetId") as DropdownWidget;
        if (!widget) 
            return;
        if (index !== 0) {
            let secondaryWidget = window.findWidget("rideSelectWidgetId") as DropdownWidget;
            this._windowState.rideSelectWidgetIndex = 0;
            secondaryWidget.selectedIndex = 0;
            let requirements = Logic.getRequirementsFromName(widget.items[index]);
            const newY = ChecklistWidgets.updateWidgets(undefined, undefined);
            RideRequirementWidgets.updateWidgets(window, requirements);
            RideRequirementWidgets.updateYStart(newY);
        }
        widget.selectedIndex = index;
        this._windowState.researchRideSelectWidgetIndex = index;
        return;
    }

    public static reloadDropdownWidgetSelection(): void {
        if (this.windowState.rideSelectWidgetIndex !== 0) {
            this.updateRideSelectDropdown(this.windowState.rideSelectWidgetIndex);
        }
        else {
            this.updateResearchRideSelectDropdown(this.windowState.researchRideSelectWidgetIndex);
        }
    }
}
import { Data } from "../data/data";
import { PLUGIN_WINDOW_CLASSIFICATION } from "../const";
import { Logic } from "../logic/logic";
import { RideRequirements } from "./RideRequirements";
import { OptionsWidget } from "./Options";
import { getPluginWindow } from "../sharedService/sharedService";

export class StatWindow {
    //@ts-ignore
    private window: Window;
    constructor() {
        let data = OptionsWidget.data;
        this.createWindow(data, false);
        this.setHooks(data);
    }

    private setHooks(data: Data) {
        let actionHook = context.subscribe('action.execute', (e) => {
            switch (e.action) {
                case 'ridecreate': 
                    let window = getPluginWindow();
                    if (data.options.openWhenCreatingRide && !window) {
                        this.createWindow(data);
                    }
                    if (data.options.autoChangeRideSelection && !window) {
                        this.updateRideSelectDropdown(1);
                    }
                    break;
                case 'ridedemolish':
                    if (data.options.closeWhenDeletingRide) {
                        getPluginWindow()?.close();
                    }
                    break;
            }
        });
        
    }
    private createWindow(data?: Data, checkDuplicates = true): void {
        if (checkDuplicates) {
            let windowExists = getPluginWindow();
            if (windowExists) {
                this.window = windowExists;
                return;
            }
        }
        this.window = ui.openWindow({
            classification: "Stat Requirement Window",
            width: 230,
            height: 300,
            title: "Ride Stat Requirements",
            tabs: [
                {
                    image: 'hide_vehicles',
                    widgets: this.getWidgets(0, 25, data)
                },
                {
                    image: 'search',
                    widgets: OptionsWidget.createWidgets(15, 60)
                },
            ],
            onTabChange: () => {
                OptionsWidget.update();
            }
        });
        this.updateWidgets();
        OptionsWidget.update();
    }

    private getWidgets(xStart: number, yStart: number, data?: Data): WidgetDesc[] {
        let widgets: WidgetDesc[] = [];
        widgets.push({
            type: "groupbox",
            x: xStart + 5,
            y: yStart + 25,
            width: 220,
            height: 230,
            name: "ride_selection",
            text: "Ride Selection"
        });
        widgets.push({
            type: "dropdown",
            items: [],
            selectedIndex: -1,
            x: xStart + 15,
            y: yStart + 40,
            width: 200,
            height: 15,
            name: "rideSelectWidgetId",
            onChange: (i) => {
                this.updateRideSelectDropdown(i);
            }
        });
        widgets.push({
            type: "dropdown",
            x: xStart + 15,
            y: yStart + 60,
            width: 200,
            height: 15,
            name: "researchRideSelectWidgetId",
            onChange: (i) => {
                this.updateResearchRideSelectDropdown(i);
            }
        });
        let statRequirements = Logic.getRequirements(-1);
        widgets = widgets.concat(RideRequirements.getWidgets(xStart + 15, yStart + 100, statRequirements));
        //widgets.push(...getDescriptions(100,100, ));
        
        return widgets;
    }

    private updateWidgets() {
        (this.window.findWidget("rideSelectWidgetId") as DropdownWidget).items = 
            [
                "---",
                ...map.rides.filter(ride => ride.classification === "ride").map(function (ride) {
                    return [ride.id, ride.name].join(" - ");
                })
            ];
        (this.window.findWidget("researchRideSelectWidgetId") as DropdownWidget).items = 
            [
                "---",
                ...park.research.inventedItems
                    .filter(item => item.type === "ride")
                    .map(item => {
                        if (item.type === "ride") {
                            let requirements = Logic.getRequirements(item.rideType);
                            return requirements ? requirements.name : "";
                        }
                        else return "";
                    })
                    .filter(name => name != "")
                    .sort()
            ]
    }

    private updateRideSelectDropdown(index: number) {
        console.log("updating ride select");
        let widget = this.window.findWidget("rideSelectWidgetId") as DropdownWidget;
        let secondaryWidget = this.window.findWidget("researchRideSelectWidgetId") as DropdownWidget;
        if (index !== 0) {
            secondaryWidget.selectedIndex = 0;
            let rideId = parseInt(widget.items[index].match(/^\d+/)?.[0]??"-1");
            let requirements = Logic.getRequirements(map.getRide(rideId) ? map.getRide(rideId).type : -1);
            RideRequirements.updateWidgets(this.window, requirements);
        }
        widget.selectedIndex = index;
    }

    private updateResearchRideSelectDropdown(index: number) {
        console.log("updating research select");
        let widget = this.window.findWidget("researchRideSelectWidgetId") as DropdownWidget;
        let secondaryWidget = this.window.findWidget("rideSelectWidgetId") as DropdownWidget;
        if (index !== 0) {
            secondaryWidget.selectedIndex = 0;
            let requirements = Logic.getRequirementsFromName(widget.items[index]);
            RideRequirements.updateWidgets(this.window, requirements);
        }
        widget.selectedIndex = index;
    }
}
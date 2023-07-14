import { Data } from "../data/data";
import { PLUGIN_CONTEXT_KEY, PLUGIN_WINDOW_CLASSIFICATION } from "../const";
import { Logic } from "../logic/logic";
import { RideRequirement } from "../data/types";
import { RideRequirements } from "./RideRequirements";

export class StatWindow {
    
    private window: Window;
    constructor() {
        let data = this.getStatWindowOptions();
        this.window = this.createWindow(data, false);
        
        this.setHooks(data);
    }

    private setHooks(data: Data) {
        context.subscribe('action.execute', (e) => {
            switch (e.action) {
                case 'ridecreate': 
                    if (data.options.openWhenCreatingRide && !ui.getWindow(PLUGIN_WINDOW_CLASSIFICATION)) {
                        this.window = this.createWindow(data);
                    }
                    if (data.options.autoChangeRideSelection && !ui.getWindow(PLUGIN_WINDOW_CLASSIFICATION)) {
                        this.window = ui.getWindow(PLUGIN_WINDOW_CLASSIFICATION);
                        this.updateRideSelectDropdown(this.window.findWidget("rideSelectWidgetId"), 1);
                    }
                    break;
                case 'ridedemolish':
                    if (data.options.closeWhenDeletingRide) {
                        this.window?.close();
                    }
                    break;
            }
        })
    }
    private createWindow(data?: Data, checkDuplicates = true): Window {
        if (checkDuplicates) {
            let windowExists = ui.getWindow(PLUGIN_WINDOW_CLASSIFICATION);
            if (windowExists) {
                this.window = windowExists;
                return windowExists;
            }
        }
        return ui.openWindow({
            classification: "Stat Requirement Window",
            width: 400,
            height: 300,
            title: "Ride Stat Requirements",
            widgets: this.getWidgets(data)
        });
    }

    private getWidgets(data?: Data): WidgetDesc[] {
        let widgets: WidgetDesc[] = [];
        widgets.push({
            type: "groupbox",
            x: 5,
            y: 25,
            width: 200,
            height: 200,
            name: "ride_selection",
            text: "Ride Selection"
        });
        let rideSelectWidgetId = widgets.push({
            type: "dropdown",
            items: map.rides.map(function (ride) {
                return [ride.id, ride.name].join(" - ");
            }),
            selectedIndex: -1,
            x: 15,
            y: 40,
            width: 180,
            height: 15,
            name: "rideSelectWidgetId",
            onChange: (i) => {
                this.updateRideSelectDropdown(this.window.widgets[rideSelectWidgetId] as DropdownWidget, i)
            }
        });
        let statRequirements = Logic.getRequirements(-1);
        widgets = widgets.concat(RideRequirements.getWidgets(statRequirements));
        //widgets.push(...getDescriptions(100,100, ));
        
        return widgets;
    }

    private updateRideSelectDropdown(widget: DropdownWidget, index: number) {
        if (widget) {
            widget.selectedIndex = index;
            let requirements = Logic.getRequirements(map.rides[index].type);
            RideRequirements.updateWidgets(this.window, requirements);
        }
    }

    private getStatWindowOptions(): Data {
        let d: Data = {
            selectedRideId: -1,
            options: {
                openWhenCreatingRide: true,
                openWhenModifyingRide: true,
                autoChangeRideSelection: true,
                closeWhenDeletingRide: true
            }
        };
        try {
            d = {
                ...d, 
                ...context.sharedStorage?.get(PLUGIN_CONTEXT_KEY)
            };//This way lets us keep old values while accomodating new values
        }
        catch (e) {
            console.log(e);
        }

        return d;
    }
}
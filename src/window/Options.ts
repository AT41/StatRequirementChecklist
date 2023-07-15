import { PLUGIN_CONTEXT_KEY } from "../const";
import { Data, Options } from "../data/data";
import { getPluginWindow } from "../sharedService/sharedService";

export class OptionsWidget {
    private static _data: Data;
    public static get data(): Data {
        return this._data;
    }
    
    public static createWidgets(xStart: number, yStart: number): WidgetDesc[] {
        let data: {[key in keyof Options]: {label: string, tooltip: string}} = {
            openWhenCreatingRide: {
                label: "Open When Creating Ride",
                tooltip: "Automatically open this window when creating a ride"
            },
            closeWhenDeletingRide: {
                label: "Close When Deleting Ride",
                tooltip: "Automatically close this window when deleting a ride"
            },
            openWhenModifyingRide: {
                label: "Open When Modifying Ride",
                tooltip: "Automatically open this window when a ride is modified"
            },
            autoChangeRideSelection: {
                label: "Change Ride Automatically",
                tooltip: "Automatically changes what ride to search when creating, constructing, or testing a ride"
            }
        };

        let yInc = 0;
        let widgets = Object.keys(data).map(key => {
            let widget = {
                type: "checkbox",
                name: key,
                x: xStart,
                y: yStart + yInc,
                width: 200,
                height: 10,
                text: data[key as keyof Options].label,
                hint: data[key as keyof Options].tooltip,
                onChange: (bool) => {
                    this._data.options[key as keyof Options] = bool;
                    this.saveData(this._data);
                    this.update();
                }
            } as WidgetDesc
            yInc += 20;
            return widget;
        });
        this.loadData();
        return widgets;
    }

    private static saveData(data: Data): void {
        console.log("Saving...");
        context.sharedStorage.set('AT41.StatRequirementChecklist.Options', data);
        console.log("Done Saving...");
    }

    private static loadData(): void {
        let d: Data = {
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
        this._data = d;
    }

    public static update(): void {
        let window = getPluginWindow();
        if (!window || !this._data) {
            return;
        }
        
        for (let key of Object.keys(this._data.options)) {
            console.log("checking " + key);
            let widget = window.findWidget(key) as CheckboxWidget;
            if (!widget) {
                continue;
            }
            widget.isChecked = this._data.options[key as keyof Options];
            console.log("set value as " + this._data.options[key as keyof Options])
        }
    }
}
import { PLUGIN_CONTEXT_KEY } from '../../const';
import { Data, Options } from '../../data/types';
import { getPluginWindow } from '../../sharedService/sharedService';

export class OptionWindow {
    private static _data: Data;
    private static optionWidgets: WidgetDesc[] | undefined;

    private static readonly X_START = 5;
    private static readonly Y_START = 50;

    private static readonly ALLOW_CHECKLIST = context.apiVersion >= 79;

    public static get data(): Data {
        return this._data;
    }

    public static createWidgets(): WidgetDesc[] {
        this.loadData();
        if (this.optionWidgets) {
            return this.optionWidgets;
        }
        return this.buildWidgets();
    }

    private static buildWidgets(): WidgetDesc[] {
        let data: {
            [key in keyof Options]: { label: string; tooltip: string };
        } = {
            openWhenCreatingEditingRide: {
                label: 'Open When Creating or Editing Ride',
                tooltip:
                    'Automatically open this window when creating/editing a ride',
            },
            openOnPrebuildSelect: {
                label: 'Open When Selecting Ride Preview',
                tooltip:
                    'Automatically open this window when choosing prebuilt rides',
            },
            autoChangeRideSelection: {
                label: 'Change Ride Automatically',
                tooltip:
                    'Automatically changes what ride to search when creating or constructing a ride',
            },
            closeWhenDeletingRide: {
                label: 'Close When Deleting Ride',
                tooltip: 'Automatically close this window when deleting a ride',
            },
            autoUpdateChecklistSelection: {
                label: 'Show Requirement Checklist',
                tooltip:
                    'Updates the current checklist when a ride is getting tested',
            },
        };

        let yInc = 20;
        let widgets: WidgetDesc[] = [
            {
                type: 'groupbox',
                x: this.X_START,
                y: this.Y_START,
                text: 'Options',
                width: 220,
                height: 140,
            },
        ];
        widgets = [
            ...widgets,
            ...Object.keys(data).map((key) => {
                let keyOfOptionReq = key as keyof Options;
                let widget = {
                    type: 'checkbox',
                    name: key,
                    x: this.X_START + 15,
                    y: this.Y_START + yInc,
                    width: 200,
                    height: 10,
                    text: data[key as keyof Options].label,
                    tooltip: data[key as keyof Options].tooltip,
                    onChange: (bool) => {
                        this._data.options[key as keyof Options] = bool;
                        this.saveData(this._data);
                        this.updateWidgets();
                    },
                } as CheckboxDesc;

                if (
                    keyOfOptionReq === 'autoUpdateChecklistSelection' &&
                    !this.ALLOW_CHECKLIST
                ) {
                    widget.isDisabled = true;
                    widget.tooltip +=
                        ' - Cannot set with current OpenRCT2 version, will be added once OpenRCT2 API is updated. (Current: ' +
                        context.apiVersion +
                        ', Planned: 79)';
                }
                yInc += 20;
                return widget;
            }),
        ];
        this.optionWidgets = widgets;
        return this.optionWidgets;
    }

    private static saveData(data: Data): void {
        context.sharedStorage.set(PLUGIN_CONTEXT_KEY, data);
    }

    public static loadData(): void {
        let d: Data = {
            options: {
                openWhenCreatingEditingRide: true,
                autoChangeRideSelection: true,
                closeWhenDeletingRide: true,
                autoUpdateChecklistSelection: true,
                openOnPrebuildSelect: true,
            },
        };
        try {
            d = {
                ...d,
                ...context.sharedStorage?.get(PLUGIN_CONTEXT_KEY),
            }; //This way lets us keep old values while accomodating new values
        } catch (e) {
            console.log(e);
        }
        if (!this.ALLOW_CHECKLIST) {
            d.options.autoUpdateChecklistSelection = false;
        }
        this._data = d;
    }

    public static updateWidgets(): void {
        let window = getPluginWindow();
        if (!window || !this._data) {
            return;
        }

        for (let key of Object.keys(this._data.options)) {
            let widget = window.findWidget(key) as CheckboxWidget;
            if (!widget) {
                continue;
            }
            widget.isChecked = this._data.options[key as keyof Options];
        }
    }
}

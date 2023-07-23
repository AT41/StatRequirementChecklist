import { RideRequirement, RIDE_REQUIREMENT_OBJ, RideRequirementLabelMap, RideRequirementValueFormatMap } from "../../data/types";
import { Logic } from "../../logic/logic";
import { getPluginWindow } from "../../sharedService/sharedService";

enum InversionRequired {
    WithInversion = "withInversion",
    WithoutInversion = "withoutInversion"
}
export class ChecklistWidgets {
    private static readonly LABEL_HEIGHT = 20;
    private static readonly LABEL_GAP = 15;
    private static readonly CHECKLIST_NAME_KEY = "Checklist";
    private static widgets: WidgetDesc[] = [];
    private static currentState: string;
    private static Y_START: number;

    public static createWidgets(xStart: number, yStart: number): WidgetDesc[] {
        if (this.widgets.length > 0) {
            return this.widgets;
        }
        return this.buildWidgets(xStart, yStart);
    }

    private static buildWidgets(xStart: number, yStart: number): WidgetDesc[] {
        if (this.widgets?.length > 0) {
            return this.widgets;
        }

        this.Y_START = yStart;
        let createChecklistRequirements = (xStart: number, yStart: number, withInversion?: InversionRequired): WidgetDesc[] => {
            type RideReqs = keyof RideRequirement;
            return Object.keys(RIDE_REQUIREMENT_OBJ).map(key => {
                let rideReqKey = key as RideReqs;

                switch (rideReqKey as RideReqs) {
                    case "highest_drop_height":
                    case "inversion":
                    case "max_lateral_g":
                    case "max_negative_g":
                    case "max_speed":
                    case "number_of_drops":
                    case "reverser_track_piece":
                    case "ride_length":
                    case "water_track_piece":
                        return {
                            type: "label",
                            x: xStart + 10,
                            y: yStart,
                            width: 180,
                            height: this.LABEL_HEIGHT,
                            name: this.getWidgetName(rideReqKey, withInversion),
                            isVisible: false,
                            text: RideRequirementLabelMap[rideReqKey]
                        };
                    case "ride_type": 
                    case "name":
                    case "optional_inversion":
                        return {
                            type: "label",
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0,
                            name: "",
                            isVisible: false,
                            text: ""
                        }
                }
            });
        }

        let createChecklistPart = (withInversion: InversionRequired, xStart: number, yStart: number): WidgetDesc[] => {
            let checklistPart: WidgetDesc[] = [{
                type: "checkbox",
                name: this.getWidgetName("", withInversion),
                x: xStart + 10,
                y: yStart,
                width: 180,
                height: this.LABEL_HEIGHT,
                text: withInversion ? "With Inversion" : "Without Inversion",
                isVisible: false,
            }]

            return checklistPart.concat(createChecklistRequirements(xStart, yStart + this.LABEL_HEIGHT, withInversion));
        }

        let widgets: WidgetDesc[] = [{
            type: "groupbox",
            x: xStart,
            y: yStart,
            text: "Checklist",
            name: this.CHECKLIST_NAME_KEY,
            isVisible: false,
            width: 200,
            height: 10
        }];
        widgets = widgets.concat(
            createChecklistPart(InversionRequired.WithInversion, xStart, yStart),
            createChecklistPart(InversionRequired.WithoutInversion, xStart, yStart),
            createChecklistRequirements(xStart, yStart)
        );
        this.widgets = widgets;
        return widgets;
    }

    public static updateWidgets(rideRequirements: RideRequirement | undefined, yStart?: number): number {
        const toWidgetNames = (rideRequirements: RideRequirement | undefined): {[key: string]: string} => {
            let widgetNames: {[key: string]: string} = {};
            if (rideRequirements?.optional_inversion === true) {
                Object.keys(rideRequirements??{}).forEach(key => {
                    const keyOfRideReq = key as keyof RideRequirement;
                    const measurement = ((rideRequirements??{} as any)[keyOfRideReq]??"").toString();
                    const inversionRequired = measurement.indexOf("*") !== -1 ? InversionRequired.WithInversion : InversionRequired.WithoutInversion;
                    widgetNames[this.getWidgetName(key as keyof RideRequirement, inversionRequired)] = measurement;
                });
                widgetNames[this.getWidgetName("", InversionRequired.WithInversion)] = "With Inversion";
                widgetNames[this.getWidgetName("", InversionRequired.WithoutInversion)] = "Without Inversion";
            }
            else {
                Object.keys(rideRequirements??{}).forEach(key => {
                    const keyOfRideReq = key as keyof RideRequirement;
                    widgetNames[this.getWidgetName(key as keyof RideRequirement)] = Logic.formatString(((rideRequirements??{} as any)[keyOfRideReq]??"").toString(), RideRequirementValueFormatMap[keyOfRideReq]);
                });
            }
            return widgetNames;
        }

        let window = getPluginWindow();
        if (!window) 
            return -1;
        if (yStart !== undefined) {
            this.Y_START = yStart;
        }
        const state = JSON.stringify(rideRequirements);
        const groupbox = window.findWidget(this.CHECKLIST_NAME_KEY);
        if (state === this.currentState) {
            return groupbox.height + groupbox.y;
        }
        const widgetNames = toWidgetNames(rideRequirements);
        let yInc = this.LABEL_GAP;
        for (let widget of this.widgets) {
            const windowWidget = window.findWidget(widget.name??"");
            if (!windowWidget) {
                //console.log("Could not find widget: " + widget.name);
                continue;
            }
            if (widgetNames[widget.name??""]) {
                console.log(widget.name);
                windowWidget.isVisible = true;
                (windowWidget as LabelWidget).text = (windowWidget as LabelWidget).text.replace(/: *$/, ": " + widgetNames[widget.name??""]);
                windowWidget.y = this.Y_START + yInc;
                yInc += this.LABEL_GAP;
            }
            else {
                windowWidget.isVisible = false;
            }
        }
        groupbox.height = yInc;
        groupbox.isVisible = !!rideRequirements;

        return groupbox.y + (rideRequirements ? groupbox.height : 0);
    }

    public static updateWidgetsHeight(yStart: number): void {
        for (let widget of this.widgets) {
            if (widget.isVisible) {
                widget.height = widget.height - this.Y_START + yStart;
            }
        }
        this.Y_START = yStart;
    }

    private static getWidgetName(widgetType: keyof RideRequirement | "", inversion?: InversionRequired): string {
        let inversionPart;
        if (inversion === InversionRequired.WithInversion) {
            inversionPart = 'withInversion';
        }
        else if (inversion === InversionRequired.WithoutInversion) {
            inversionPart = 'withoutInversion';
        }
        return (inversionPart??"") + widgetType + this.CHECKLIST_NAME_KEY;
    }
}
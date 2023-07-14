import { RideRequirement } from "../data/types";

export class RideRequirements {
    private static _widgets: WidgetDesc[];
    private static readonly Y_INCREMENT_HEIGHT = 15;
    private static readonly LABEL_HEIGHT = 20;
    private static Y_START: number;
    private static readonly NAME = "Ride Stats Box";

    public static getWidgets(statRequirements: RideRequirement | null): WidgetDesc[] {
        if (!this._widgets) {
            return this.buildWidgets(50,100);
        }
        return this._widgets??[];
    }

    public static updateWidgets(window: Window, statRequirements: RideRequirement | null): void {
        let rideReqs: RideRequirement = {
            name: "",
            highest_drop_height: "",
            number_of_drops: "",
            max_speed: "",
            ride_length: "",
            max_negative_g: "",
            max_lateral_g: "",
            inversion: "",
            reverser_track_piece: "",
            water_track_piece: ""
        }
        let numberOfLines = 0;
        Object.keys(rideReqs).forEach((key) => {
            let keyAsReq = key as keyof RideRequirement;
            let widget: Widget & {text: string} = window.findWidget(key);
            numberOfLines += !!statRequirements?.[keyAsReq] ? 1 : 0;
            widget.isVisible = !!statRequirements?.[keyAsReq];
            widget.text = widget.text.replace(/: $/, ": " + (statRequirements?.[keyAsReq] ? statRequirements[keyAsReq] as string : ""));
            widget.y = this.Y_START + (numberOfLines) * (this.Y_INCREMENT_HEIGHT);
        });
        window.findWidget(this.NAME).height = 20 + (numberOfLines) * (this.Y_INCREMENT_HEIGHT);
    }

    private static buildWidgets(startX: number, startY: number): WidgetDesc[] {
        this.Y_START = startY;
        if (this._widgets)
            return this._widgets;
        
        let rideReqs: RideRequirement = {
            name: "",
            highest_drop_height: "",
            number_of_drops: "",
            max_speed: "",
            ride_length: "",
            max_negative_g: "",
            max_lateral_g: "",
            inversion: "",
            reverser_track_piece: "",
            water_track_piece: ""
        }
        type RideReqs = keyof RideRequirement;
        let yIncrement = 0;
        let descriptionWidgets: WidgetDesc[] = [];
        descriptionWidgets.push({
            type: "groupbox",
            name: this.NAME,
            text: "Stat Requirements",
            x: startX,
            y: startY,
            width: 200,
            height: 200
        });
        descriptionWidgets = descriptionWidgets.concat(Object.keys(rideReqs).filter(key => key !== "ride_type").map(
            (key => {
                let keyRideReq = key as RideReqs;
                yIncrement += this.Y_INCREMENT_HEIGHT;
                switch (keyRideReq as RideReqs) {
                    case "name":
                        return {
                            type: "label",
                            x: startX + 10,
                            y: startY + yIncrement,
                            width: 180,
                            height: this.LABEL_HEIGHT,
                            name: keyRideReq,
                            isVisible: false,
                            text: "Ride Name: "
                        };
                    case "highest_drop_height":
                        return {
                            type: "label",
                            x: startX + 10,
                            y: startY + yIncrement,
                            width: 180,
                            height: this.LABEL_HEIGHT,
                            name: keyRideReq,
                            isVisible: false,
                            text: "Highest Drop Height: "
                        };
                    case "number_of_drops":
                        return {
                            type: "label",
                            x: startX + 10,
                            y: startY + yIncrement,
                            width: 180,
                            height: this.LABEL_HEIGHT,
                            name: keyRideReq,
                            isVisible: false,
                            text: "Number of Drops: "
                        };
                    case "max_lateral_g":
                        return {
                            type: "label",
                            x: startX + 10,
                            y: startY + yIncrement,
                            width: 180,
                            height: this.LABEL_HEIGHT,
                            name: keyRideReq,
                            isVisible: false,
                            text: "Max Lateral Gs: "
                        };
                    case "max_negative_g":
                        return {
                            type: "label",
                            x: startX + 10,
                            y: startY + yIncrement,
                            width: 180,
                            height: this.LABEL_HEIGHT,
                            name: keyRideReq,
                            isVisible: false,
                            text: "Max Negative Gs: "
                        };
                    case "inversion":
                        return {
                            type: "label",
                            x: startX + 10,
                            y: startY + yIncrement,
                            width: 180,
                            height: this.LABEL_HEIGHT,
                            name: keyRideReq,
                            isVisible: false,
                            text: "Inversions: "
                        };
                    case "max_speed":
                        return {
                            type: "label",
                            x: startX + 10,
                            y: startY + yIncrement,
                            width: 180,
                            height: this.LABEL_HEIGHT,
                            name: keyRideReq,
                            isVisible: false,
                            text: "Max Speed: "
                        };
                    case "ride_length":
                        return {
                            type: "label",
                            x: startX + 10,
                            y: startY + yIncrement,
                            width: 180,
                            height: this.LABEL_HEIGHT,
                            name: keyRideReq,
                            isVisible: false,
                            text: "Ride Length: "
                        };
                    case "reverser_track_piece":
                        return {
                            type: "label",
                            x: startX + 10,
                            y: startY + yIncrement,
                            width: 180,
                            height: this.LABEL_HEIGHT,
                            name: keyRideReq,
                            isVisible: false,
                            text: "Reverser Track Piece: "
                        };
                    case "water_track_piece":
                        return {
                            type: "label",
                            x: startX + 10,
                            y: startY + yIncrement,
                            width: 180,
                            height: this.LABEL_HEIGHT,
                            name: keyRideReq,
                            isVisible: false,
                            text: "Water Track Piece: "
                        }
                    case "ride_type": 
                        return {
                            type: "label",
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0,
                            name: keyRideReq,
                            isVisible: false,
                            text: ""
                        }

                }
            })
        ));

        this._widgets = descriptionWidgets;
        return this._widgets;
    }
}
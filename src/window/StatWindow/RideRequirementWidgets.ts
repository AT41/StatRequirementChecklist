import {
    RIDE_REQUIREMENT_OBJ,
    RideRequirement,
    RideRequirementLabelMap,
    RideRequirementValueFormatMap,
} from '../../data/types';
import { Logic } from '../../logic/logic';
import { getPluginWindow } from '../../sharedService/sharedService';

export class RideRequirementWidgets {
    private static _widgets: WidgetDesc[];
    private static readonly Y_INCREMENT_HEIGHT = 15;
    private static readonly LABEL_HEIGHT = 20;
    private static Y_START: number;
    private static readonly NAME = 'Ride Stats Box';

    public static createWidgets(xStart: number, yStart: number): WidgetDesc[] {
        if (!this._widgets) {
            return this.buildWidgets(xStart, yStart);
        }
        return this._widgets;
    }

    public static updateWidgets(
        window: Window,
        statRequirements: RideRequirement | null,
    ): number {
        let numberOfLines = 0;
        Object.keys(RIDE_REQUIREMENT_OBJ).forEach((key) => {
            let keyAsReq = key as keyof RideRequirement;
            let widget: Widget & { text: string } = window.findWidget(key);
            numberOfLines += !!statRequirements?.[keyAsReq] ? 1 : 0;
            widget.isVisible = !!statRequirements?.[keyAsReq];

            if ((key as keyof RideRequirement) !== 'optional_inversion') {
                widget.text = widget.text.replace(
                    /: .*$/,
                    ': ' +
                        Logic.formatString(
                            statRequirements?.[keyAsReq]
                                ? (statRequirements[keyAsReq] as string)
                                : '',
                            RideRequirementValueFormatMap[keyAsReq],
                        ),
                );
            }
            widget.y = this.Y_START + numberOfLines * this.Y_INCREMENT_HEIGHT;
        });
        let groupbox = window.findWidget(this.NAME);
        groupbox.isVisible = true;
        groupbox.y = this.Y_START;
        let groupboxYEnd =
            this.Y_START + (numberOfLines + 1) * this.Y_INCREMENT_HEIGHT + 5;
        groupbox.height = groupboxYEnd - groupbox.y;
        return groupboxYEnd;
    }

    private static buildWidgets(startX: number, startY: number): WidgetDesc[] {
        this.Y_START = startY;
        if (this._widgets) return this._widgets;

        type RideReqs = keyof RideRequirement;
        let yIncrement = 0;
        let descriptionWidgets: WidgetDesc[] = [];
        descriptionWidgets.push({
            type: 'groupbox',
            name: this.NAME,
            text: 'Stat Requirements',
            x: startX,
            y: startY,
            isVisible: false,
            width: 200,
            height: 20,
        });
        descriptionWidgets = descriptionWidgets.concat(
            Object.keys(RIDE_REQUIREMENT_OBJ)
                .filter((key) => key !== 'ride_type')
                .map((key) => {
                    let keyRideReq = key as RideReqs;
                    yIncrement += this.Y_INCREMENT_HEIGHT;
                    switch (keyRideReq as RideReqs) {
                        case 'name':
                        case 'highest_drop_height':
                        case 'number_of_drops':
                        case 'max_lateral_g':
                        case 'max_negative_g':
                        case 'inversion':
                        case 'max_speed':
                        case 'ride_length':
                        case 'reverser_track_piece':
                        case 'water_track_piece':
                        case 'optional_inversion':
                            return {
                                type: 'label',
                                x: startX + 10,
                                y: startY + yIncrement,
                                width: 180,
                                height: this.LABEL_HEIGHT,
                                name: keyRideReq,
                                isVisible: false,
                                text: RideRequirementLabelMap[keyRideReq],
                            };
                        case 'ride_type':
                            return {
                                type: 'label',
                                x: 0,
                                y: 0,
                                width: 0,
                                height: 0,
                                name: keyRideReq,
                                isVisible: false,
                                text: '',
                            };
                    }
                }),
        );

        this._widgets = descriptionWidgets;
        return this._widgets;
    }

    public static updateYStart(newY: number): void {
        const window = getPluginWindow();
        if (!window) return;
        for (let widget of this._widgets) {
            window.findWidget(widget.name ?? '').y += newY - this.Y_START;
        }
        this.Y_START = newY;
    }
}

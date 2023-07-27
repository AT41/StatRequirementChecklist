import { Logic } from '../../logic/logic';
import { getPluginWindow } from '../../sharedService/sharedService';
import { ChecklistWidgets } from './ChecklistWidgets';
import { RideRequirementWidgets } from './RideRequirementWidgets';

interface RideSelectionState {
    rideSelectWidgetIndex: number;
    researchRideSelectWidgetIndex: number;
    currentSelectedRideId: number; //Custom ID of ride, Eg. My Coaster 1
    currentSelectedRideType: number; //Ride Type's ID, Eg. Wooden Roller Coaster
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
        currentSelectedRideId: -1,
        currentSelectedRideType: -1,
    };

    public static getCurrentRideId(): number {
        return this._windowState.currentSelectedRideId;
    }

    public static getCurrentRideType(): number {
        return this._windowState.currentSelectedRideType;
    }

    public static createWidgets(xStart: number, yStart: number): WidgetDesc[] {
        if (this.widgets) {
            return this.widgets;
        }
        this.xStart = xStart;
        this.yStart = yStart;
        this.widgets = [];
        this.widgets.push({
            type: 'dropdown',
            items: [],
            selectedIndex: -1,
            x: this.xStart,
            y: this.yStart,
            width: this.WIDTH - 20,
            height: this.DROPDOWN_HEIGHT,
            name: 'rideSelectWidgetId',
            onChange: (i) => {
                this.updateRideSelectDropdown(i);
            },
        });
        this.widgets.push({
            type: 'dropdown',
            x: this.xStart,
            y: this.yStart + 20,
            width: this.WIDTH - 20,
            height: this.DROPDOWN_HEIGHT,
            name: 'researchRideSelectWidgetId',
            onChange: (i) => {
                this.updateResearchRideSelectDropdown(i);
            },
        });
        return this.widgets;
    }

    public static updateDropdownWidgetItems(): void {
        let window = getPluginWindow();
        if (!window) return;
        const rideSelectWidget = window.findWidget(
            'rideSelectWidgetId',
        ) as DropdownWidget;
        const researchSelectWidget = window.findWidget(
            'researchRideSelectWidgetId',
        ) as DropdownWidget;
        if (rideSelectWidget) {
            rideSelectWidget.items = [
                '---',
                ...map.rides
                    .filter((ride) => ride.classification === 'ride')
                    .map(function (ride) {
                        return [ride.id, ride.name].join(' - ');
                    }),
            ];
        }

        if (researchSelectWidget) {
            researchSelectWidget.items = [
                '---',
                ...park.research.inventedItems
                    .filter((item) => item.type === 'ride')
                    .map((item) => {
                        if (item.type === 'ride') {
                            return Logic.typeToName(item.rideType);
                        } else return '';
                    })
                    .filter((name) => name != '')
                    .sort(),
            ];
        }
    }

    public static resetState(): void {
        this._windowState = {
            rideSelectWidgetIndex: 0,
            researchRideSelectWidgetIndex: 0,
            currentSelectedRideId: -1,
            currentSelectedRideType: -1,
        };
    }

    public static updateRideSelectDropdown(index: number): void {
        let window = getPluginWindow();
        if (!window) return;
        this._windowState.currentSelectedRideId = -1;
        let widget = window.findWidget('rideSelectWidgetId') as DropdownWidget;
        if (!widget) return;
        if (index !== 0) {
            let secondaryWidget = window.findWidget(
                'researchRideSelectWidgetId',
            ) as DropdownWidget;
            secondaryWidget.selectedIndex = 0;
            this._windowState.researchRideSelectWidgetIndex = 0;
            const currentRideId = parseInt(
                widget.items[index].match(/^\d+/)?.[0] ?? '-1',
            );
            const currentRide = map.getRide(currentRideId);
            this._windowState.currentSelectedRideId = currentRideId;
            let requirements = Logic.getRequirements(
                currentRide ? currentRide.type : -1,
            );
            this._windowState.currentSelectedRideType = currentRide
                ? currentRide.type
                : -1;

            const newY = ChecklistWidgets.updateWidgets(undefined, undefined);
            RideRequirementWidgets.updateWidgets(window, requirements);
            RideRequirementWidgets.updateYStart(newY);
        }
        widget.selectedIndex = index;
        this._windowState.rideSelectWidgetIndex = index;
    }

    public static updateResearchRideSelectDropdown(index: number): void {
        let window = getPluginWindow();
        if (!window) return;
        let widget = window.findWidget(
            'researchRideSelectWidgetId',
        ) as DropdownWidget;
        if (!widget) return;
        if (index !== 0) {
            let secondaryWidget = window.findWidget(
                'rideSelectWidgetId',
            ) as DropdownWidget;
            this._windowState.rideSelectWidgetIndex = 0;
            secondaryWidget.selectedIndex = 0;
            let requirements = Logic.getRequirementsFromName(
                widget.items[index],
            );
            this._windowState.currentSelectedRideType = requirements
                ? parseInt(requirements.ride_type ?? '-1')
                : -1;
            const newY = ChecklistWidgets.updateWidgets(undefined, undefined);
            RideRequirementWidgets.updateWidgets(window, requirements);
            RideRequirementWidgets.updateYStart(newY);
        }
        widget.selectedIndex = index;
        this._windowState.researchRideSelectWidgetIndex = index;
        return;
    }

    public static reloadDropdownWidgetSelection(): void {
        if (this._windowState.rideSelectWidgetIndex !== 0) {
            this.updateRideSelectDropdown(
                this._windowState.rideSelectWidgetIndex,
            );
        } else {
            this.updateResearchRideSelectDropdown(
                this._windowState.researchRideSelectWidgetIndex,
            );
        }
    }
}

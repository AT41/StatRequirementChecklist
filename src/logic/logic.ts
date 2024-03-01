import { FormatStringType, RideRequirement, RideType } from '../data/types';
import reqs from '../data/reqs.json';

export class Logic {
    public static requirements = reqs as { [key: string]: RideRequirement };

    public static getRequirements(rideType: number): RideRequirement | null {
        let rideName = RideType[rideType];
        return this.getRequirementsFromName(rideName);
    }
    public static getRequirementsFromName(
        rideName: string,
    ): RideRequirement | null {
        //console.log("getting requirement for " + rideName);
        if (this.requirements[rideName]) {
            return this.requirements[rideName];
        }
        return null;
    }
    public static typeToName(rideType: number): string {
        return RideType[rideType];
    }
    public static formatString(
        rideRequirement: string,
        type: FormatStringType | undefined,
    ) {
        if (!type) {
            return rideRequirement;
        }
        let measurement = parseInt(rideRequirement.match(/\d+/)?.[0] ?? '');
        if (type !== FormatStringType.VELOCITY) {
            const unitOfMeasure = context
                .formatString(type, measurement)
                .match(/[^0-9\s]+/)?.[0];
            return this.formatStringVelocity(measurement, unitOfMeasure ?? '');
        }
        return context.formatString(type, measurement);
    }
    private static formatStringVelocity(
        measurementInMetric: number,
        unitOfMeasure: string,
    ) {
        let measurement = measurementInMetric;
        // GH Issue #1: formatString() expects measurement to be mph
        // But the formatter takes an integer, so precision is lost.
        // We manually do our conversions based on the unit of measure returned
        switch (unitOfMeasure) {
            case 'mph':
                measurement = Math.round(measurementInMetric * 0.621371);
                break;
        }
        return `${measurement} ${unitOfMeasure}`;
    }
    //Check Lay-down coaster, multi dimensional coaster
}

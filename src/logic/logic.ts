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
        return context.formatString(
            type,
            parseInt(rideRequirement.match(/\d+/)?.[0] ?? ''),
        );
    }
    //Check Lay-down coaster, multi dimensional coaster
}

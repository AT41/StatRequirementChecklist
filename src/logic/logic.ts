import { RideRequirement, RideType } from '../data/types';
import reqs from './reqs.json';
export class Logic {
    public static requirements = reqs as {[key: string]: RideRequirement};

    public static getRequirements(rideType: number): RideRequirement | null {
        let rideName = RideType[rideType];
        console.log("Checking for: " + rideName);
        if (this.requirements[rideName]) {
            console.log("found " + rideName);
            return this.requirements[rideName];
        }
        return null;
    }
    //Check Lay-down coaster, multi dimensional coaster
}
export interface RideRequirement {
    name: string,
    highest_drop_height?: string,
    number_of_drops?: string,
    max_speed?: string,
    ride_length?: string,
    max_negative_g?: string,
    max_lateral_g?: string,
    inversion?: string,
    reverser_track_piece?: string,
    water_track_piece?: string,
    ride_type?: string
    optional_inversion?: boolean
}

export interface Data {
    options: Options;
}

export interface Options {
    openWhenCreatingRide: boolean;
    closeWhenDeletingRide: boolean;
    openWhenModifyingRide: boolean;
    autoChangeRideSelection: boolean;
    autoUpdateChecklistSelection: boolean;
}

export const RIDE_REQUIREMENT_OBJ = {
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
};

export const RideRequirementLabelMap: {[key in keyof RideRequirement]: string} = {
    name: "Ride Name: ",
    highest_drop_height: "Highest Drop Height: ",
    number_of_drops: "Number of Drops: ",
    max_lateral_g: "Max Lateral Gs: ",
    max_negative_g: "Max Negative Gs: ",
    inversion: "Inversions: ",
    max_speed: "Max Speed: ",
    ride_length: "Ride Length: ",
    reverser_track_piece: "Reverser Track Piece: ",
    water_track_piece: "Water Track Piece: "
}

export enum FormatStringType {
    LENGTH = "{LENGTH}",
    HEIGHT = "{HEIGHT}",
    VELOCITY = "{VELOCITY}"
}

export const RideRequirementValueFormatMap: {[key in keyof RideRequirement]: FormatStringType | undefined} = {
    name: undefined,
    highest_drop_height: FormatStringType.HEIGHT,
    max_speed: FormatStringType.VELOCITY,
    ride_length: FormatStringType.LENGTH
}
/* eslint-disable camelcase */
// eslint-disable-next-line import/prefer-default-export
// from https://github.com/ltsSmitty/OpenRCT-Ride-Painter/blob/main/src/helpers/RideType.ts
// https://github.com/OpenRCT2/OpenRCT2/blob/develop/src/openrct2/ride/Ride.h#L503
export enum RideType {
    "Spiral Roller Coaster", // 0
    "Stand Up Roller Coaster",
    "Suspended Swinging Coaster",
    "Inverted Roller Coaster",
    "Junior Roller Coaster",
    "Miniature Railway",
    "Monorail",
    "Mini Suspended Roller Coaster",
    "Boat Hire",
    "Wooden Wild Mouse",
    "Steeplechase", // 10
    "Car Ride",
    "Launched Freefall",
    "Bobsleigh Coaster",
    "Observation Tower",
    "Looping Roller Coaster",
    "Dinghy Slide",
    "Mine Train Coaster",
    "Chairlift",
    "Corkscrew Roller Coaster",
    "Maze", // 20
    "Spiral Slide",
    "Go Karts",
    "Log Flume",
    "River Rapids",
    "Dodgems",
    "Swinging Ship",
    "Swinging Inverter Ship",
    "Food Stall",
    "1d",
    "Drink Stall", // 30
    "1f",
    "Shop",
    "Merry Go Round",
    "22 ",
    "Information Kiosk",
    "Toilets",
    "Ferris Wheel",
    "Motion Simulator",
    "3d Cinema",
    "Top Spin", // 40
    "Space Rings",
    "Reverse Freefall Coaster",
    "Lift",
    "Vertical Drop Roller Coaster",
    "Cash Machine",
    "Twist",
    "Haunted House",
    "First Aid",
    "Circus",
    "Ghost Train", // 50
    "Twister Roller Coaster",
    "Wooden Roller Coaster",
    "Side Friction Roller Coaster",
    "Steel Wild Mouse",
    "Multidimension Roller Coaster",
    "Multidimension Roller Coaster (alt)",
    "Flying Roller Coaster",
    "Flying Roller Coaster (alt)",
    "Virginia Reel",
    "Splash Boats", // 60
    "Mini Helicopters",
    "Lay Down Roller Coaster",
    "Suspended Monorail",
    "Lay Down Roller Coaster (alt)",
    "Reverser Roller Coaster",
    "Heartline Twister Coaster",
    "Mini Golf",
    "Giga Coaster",
    "Roto Drop",
    "Flying Saucers", // 70
    "Crooked House",
    "Monorail Cycles",
    "Compact Inverted Coaster",
    "Water Roller Coaster",
    "Air Powered Vertical Coaster",
    "Inverted Hairpin Coaster",
    "Magic Carpet",
    "Submarine Ride",
    "River Rafts",
    "Type 50", // 80
    "Enterprise",
    "52 ",
    "53 ",
    "54 ",
    "55 ",
    "Inverted Impulse Coaster",
    "Mini Roller Coaster",
    "Mine Ride",
    "59 ",
    "LIM Launched Roller Coaster", //  90
    "Hypercoaster",
    "Hypertwister",
    "Monster Trucks",
    "Spinning Wild Mouse",
    "Classic Mini Roller Coaster",
    "Hybrid Coaster",
    "Single Rail Roller Coaster",
    "Alpine Roller Coaster",
    "Classic Wooden Roller Coaster"
}
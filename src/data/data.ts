export interface Data {
    selectedRideId: number;
    options: Options;
}

interface Options {
    openWhenCreatingRide: boolean;
    closeWhenDeletingRide: boolean;
    openWhenModifyingRide: boolean;
    autoChangeRideSelection: boolean;
}
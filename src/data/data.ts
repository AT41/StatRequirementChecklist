export interface Data {
    options: Options;
}

export interface Options {
    openWhenCreatingRide: boolean;
    closeWhenDeletingRide: boolean;
    openWhenModifyingRide: boolean;
    autoChangeRideSelection: boolean;
}
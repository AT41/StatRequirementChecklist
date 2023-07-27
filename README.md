# Ride Stat Requirements

![Plugin Window](/examples/pluginWindow.png)

A small popup displaying what stats are required for each ride.
No more manual searching for your current ride!

Inspired by <a href="https://openrct2plugins.org/plugin/R_kgDOIMaptw/OpenRCT2.RideRequirements">jacknull1991's Ride Requirement Plugin</a>, with a few upgrades.

![Example](/examples/demo.gif)

## Acknowledgements

Thanks to Crazycolbster and Smitty for allowing use of their ride type enum map linked <a href="https://github.com/Crazycolbster/rollercoaster-tycoon-randomizer/blob/General_Killmore/src/ridetypes.ts">here!</a>

Typescript boilerplate taken from <a href="https://github.com/Basssiiie/OpenRCT2-Simple-Typescript-Template">Basssiiie's Typescript Template</a>

## Installation

Download the latest <a href="https://github.com/AT41/StatRequirementChecklist/releases">release file</a> from Github. Grab StatRequirementChecklist.js and move it into your OpenRCT2 plugin folder.

## Plugin Options

-   Open When Creating or Editing Ride: When creating a new ride or modifying an existing one, the window will open automatically.
    Closing the window will prevent it from popping up again, unless a different ride is chosen to be edited.
-   Open When Selecting Ride Preview: When choosing from the list of saved rides, the window will open automatically.
-   Change Ride Automatically: When a ride is under construction, the window will automatically display the stats for the current ride.
-   Close When Deleting Ride: When a ride is demolished, the window will automatically close.
-   Show Requirement Checklist: Shows a checklist of stats that have yet to be fulfilled. Currently a work in progress.

## Future Plans

I plan to add an updating checklist of requirements for a selected ride. Maybe I will add a detailed Excitement/Intensity/Nausea breakdown as well.

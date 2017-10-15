# AH-Timesheets

AH-Timesheets is a module from AH-ERP which has been stripped out for demo purposes. It allows users to track time against a given project which is then used for project costing purposes. For context, AH-ERP is a lightweight ERP system currently saved in a private repository. 

- [Demo](http://rbyrne.info/ah-timesheets/)

## Quickstart

AH-Timesheets was built to be served off a WAMP server and NPM is only used for webpack. This demo saves to a global variable instead of a database.

1. `npm run dev` - Compiles the project uncompressed
2. `npm run bunlde` - Complies the project minified

## Usage

Each time entry requires the following:

1. Date - The date which the work occured. 
2. Project - The project which was worked on. As this is not linked to the full ERP system a randomly generated list of projects is used instead.
3. Nominal - The type of work the user was doing.
4. Description - Description of the work.
5. Hour - How long was spent (in 0.25hr increments).
# Disney API Assessment
https://github.com/jhackwell/

## Running
(Navigate to source directory)
`docker build -t disney-challenge .`
`docker run --name disney-challenge --rm -p 8080:8080 disney-challenge`
Your server will now be available at `localhost:8080`.  The root endpoint is `/api/v1/title`.

## Ending Server
`docker kill disney-challenge`

## Technologies
This toy application keeps all title metadata in memory, and manipulates it using raw JSON object manipulation. The server itself runs in Express 4.x on top of Node 4.x.  The only other dependency is Lodash. 

## Running tests
`docker run disney-challenge /usr/app/node_modules/mocha/bin/mocha`

## API Routes
#### CREATE
`/api/v1/title/`
METHOD: POST
PARAMETERS: Requires POST with `Content-Type: application/json`.  The Post data must be a valid JSON describing the title to be created.

#### UPDATE
`/api/v1/title/`
METHOD: PUT
PARAMETERS: `searchString` (for title to replace), `update` (new value)

#### DELETE
`/api/v1/title/`
METHOD: DELETE
PARAMETERS: `searchString`

#### SEARCH
`/api/v1/title/`
METHOD: GET
PARAMETERS: `searchString`

## Known Issues
Deleting a title currently results in an empty title being left in the metadata database.
Operations do not currently intelligently handle nested metadata-- for instance, calling `DELETE` on 'Season 1' will delete ALL matching results.
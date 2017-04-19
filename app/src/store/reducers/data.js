import * as t from '../action-types';

import * as sql from 'sql.js';
import Intersect from 'turf-intersect';
import Area from 'turf-area';
import * as turf from 'turf';

const electron = window.require('electron');
const fs = electron.remote.require('fs');

const initialData = {
    plants: [],
    study_areas: [],
    use_plants: [],
    use_area: [],
    intersected_polys: null,
    intersected_area: null,
    error_modal: false,
    dbType: 'cloud'
};

export default (state = initialData, action) => {
    switch (action.type) {
        case t.ADD_FLOWER:
            const newPlant = state.plants.filter(o => o.plant_id.toString() === action.flower.toString())
            newPlant["0"].plant_placement = '50'

            return {
                ...state,
                use_plants: [...state.use_plants, newPlant[0]]
            };

        case t.REMOVE_FLOWER:
            const afterRemoved = state.use_plants.filter(o => o.plant_id.toString() !== action.flower.toString())

            return {
                ...state,
                use_plants: afterRemoved
            };

        case t.UPDATE_PLACEMENT:
            const plantToUpdate = state.use_plants.filter(o => o.plant_id.toString() === action.update.id.toString())
            plantToUpdate["0"].plant_placement = action.update.val

            return {
                ...state,
                use_plants: state.use_plants.map((plant) => plant.plant_id.toString() === action.update.id.toString() ? { ...plant,
                    plant_placement: action.update.val
                } : plant)
            };

        case t.ADD_AREA:
            const newArea = state.study_areas.filter(o => o.area_id.toString() === action.area.toString())

            return {
                ...state,
                use_area: newArea
            };

        case t.CONNECT_DATABASE:
            const fileBuffer = fs.readFileSync(action.dbDataPath)
            const db = new sql.Database(fileBuffer)
            const dbPath = action.dbDataPath

            const parsedData = parseDB(db, dbPath)

            return {
                ...state,
                dbObj: db,
                dbPath,
                plants: parsedData[0],
                study_areas: parsedData[1],
            };

        case t.CONNECT_GEOJSON:
            const geoJSONFile = fs.readFileSync(action.geoJSONDataPath, 'utf8');

            const parsedGeoJSON = JSON.parse(geoJSONFile);

            return {
                ...state,
                parsedGeoJSON
            };

        case t.CONNECT_DATABASE_CLOUD:
            let dbData = action.data
            let flowers = dbData[1]

            let study_areas = dbData[0]

            console.log(study_areas.features)
            let allAreas = []
            study_areas.features.map((record) => {
                console.log(record)

                var obj = {}
                obj['area_id'] = record.properties.area_id
                obj['study_descr'] = record.properties.study_descr
                obj['study_area'] = record.properties.study_area
                obj['geom'] = JSON.stringify(record.geometry)
                allAreas.push(obj)
            })

            console.log(allAreas)

            return {
                ...state,
                plants: flowers,
                study_areas: allAreas,
                use_plants: [],
                use_areas: []
            }

        case t.ON_ERROR:
            console.log(action)
            return {
                ...state,
                error_modal: true,
                error_msg: action.error.toString()
            }

        case t.ADD_FLOWER_DB:
            let loadedDB = state.dbObj
            let loadedDBPath = state.dbPath

            const newFlowerNameVal = action.newFlowerVals.newFlowerNameVal
            const newFlowerIndexVal = action.newFlowerVals.newFlowerIndexVal
            const newFlowerRadiusVal = action.newFlowerVals.newFlowerRadiusVal

            loadedDB.run("INSERT INTO flowers (plant_name, plant_index, plant_radius) VALUES (:name, :index, :radius)", {
                ':name': newFlowerNameVal,
                ':index': newFlowerIndexVal,
                ':radius': newFlowerRadiusVal
            });

            //TODO: this is an ugly hack to persist the data. It works, though...
            fs.writeFile(loadedDBPath, loadedDB.export())

            loadedDB.close()

            var fileBuffer = fs.readFileSync(state.dbPath)
            var newDB = new sql.Database(fileBuffer)
            var parsedData = parseDB(newDB)

            return {
                ...state,
                dbObj: newDB,
                plants: parsedData[0],
                study_areas: parsedData[1],
            };

        case t.REMOVE_FLOWER_DB:
            var loadedDB = state.dbObj
            var loadedDBPath = state.dbPath

            try {
                loadedDB.run("DELETE FROM flowers WHERE plant_id = :id", {
                    ':id': action.flowerId
                });
            } catch (err){
                var fileBuffer = fs.readFileSync(state.dbPath)
                var newDB = new sql.Database(fileBuffer)
                newDB.run("DELETE FROM flowers WHERE plant_id = :id", {
                    ':id': action.flowerId
                });
            }

            fs.writeFile(loadedDBPath, loadedDB.export())

            loadedDB.close()

            var fileBuffer = fs.readFileSync(state.dbPath)
            var newDB = new sql.Database(fileBuffer)

            var parsedData = parseDB(newDB, loadedDBPath)

            return {
                ...state,
                dbObj: newDB,
                plants: parsedData[0],
                study_areas: parsedData[1],
                use_plants: [],
                use_area: []
            };

        case t.ADD_AREA_DB:
            var loadedDB = state.dbObj
            var loadedDBPath = state.dbPath

            const newAreaNameVal = action.newArea.newAreaNameVal
            const newAreaDescriptionVal = action.newArea.newAreaDescriptionVal
            const newAreaGeomVal = action.newArea.newAreaGeomVal

            loadedDB.run("INSERT INTO study_areas (study_area, study_descr, geom) VALUES (:name, :descr, :geom)", {
                ':name': newAreaNameVal,
                ':descr': newAreaDescriptionVal,
                ':geom': newAreaGeomVal
            });

            fs.writeFile(loadedDBPath, loadedDB.export())

            loadedDB.close()

            var fileBuffer = fs.readFileSync(state.dbPath)
            var newDB = new sql.Database(fileBuffer)
            var parsedData = parseDB(newDB)

            return {
                ...state,
                dbObj: newDB,
                plants: parsedData[0],
                study_areas: parsedData[1],
            };

        case t.REMOVE_AREA_DB:
            var loadedDB = state.dbObj
            var loadedDBPath = state.dbPath

            loadedDB.run("DELETE FROM study_areas WHERE area_id = :id", {
                ':id': action.areaId
            });

            fs.writeFile(loadedDBPath, loadedDB.export())

            loadedDB.close()

            var fileBuffer = fs.readFileSync(state.dbPath)
            var newDB = new sql.Database(fileBuffer)
            var parsedData = parseDB(newDB)

            return {
                ...state,
                dbObj: newDB,
                plants: parsedData[0],
                study_areas: parsedData[1],
                use_plants: [],
                use_area: []
            };

        case t.RUN_SIMULATION:
            var params = action.params

            let intersection = runSimulation(params, state)

            return{
                ...state,
                intersected_polys: intersection[0],
                intersected_area: intersection[1],
                flowers_result: intersection[2]
            };

        case t.NEW_RUN:
            return{
                ...state,
                use_plants: [],
                use_area: [],
                intersected_polys: null,
                intersected_area: null,
                flowers_result: null
            };

        case t.CHOOSE_DB_TYPE:
            console.log(action.dbType)
            return{
                ...state,
                dbType: action.dbType
            }

        default:
            return state
    }
}

function parseDB (db, dbPath){
    // var flowerTable = db.exec('select * from flowers;')
    // var areaTable = db.exec('select * from study_areas;')

    try {
        var flowerTable = db.exec('select * from flowers;')
        var areaTable = db.exec('select * from study_areas;')
    } catch (err) {
        console.log('error catched, reconnect to the db! Error: ' + err)
        var loadedDBPath = dbPath
        var fileBuffer = fs.readFileSync(loadedDBPath)
        var reloadedDB = new sql.Database(fileBuffer)
        console.log(reloadedDB.exec("SELECT `name`, `sql` FROM `sqlite_master` WHERE type='table';"))
        var flowerTable = reloadedDB.exec('select * from flowers;')
        var areaTable = reloadedDB.exec('select * from study_areas;')
    }


    const allFlowers = []
    const allAreas = []

    if(flowerTable.length > 0) {
        const flower_cols = flowerTable[0].columns
        const flower_rows = flowerTable[0].values


        flower_rows.map((record) => {
            var obj = {}
            obj[flower_cols[0]] = record[0]
            obj[flower_cols[1]] = record[1]
            obj[flower_cols[2]] = record[2]
            obj[flower_cols[3]] = record[3]
            allFlowers.push(obj)
        })
    }

    if (areaTable.length > 0) {
        const area_cols = areaTable[0].columns
        const area_rows = areaTable[0].values


        area_rows.map((record) => {
            var obj = {}
            obj[area_cols[0]] = record[0]
            obj[area_cols[1]] = record[1]
            obj[area_cols[2]] = record[2]
            obj[area_cols[3]] = record[3]
            allAreas.push(obj)
        })
    }

  return [allFlowers, allAreas]
}

function parseDBCloud () {
    let allAreas
    let allFlowers

    // Get areas data
    fetch('http://beeapp-webgisapps.rhcloud.com/studyareas')
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                // Examine the text in the response
                response.json().then(function (data) {
                    allAreas = data;
                });

                // Get flowers data
                fetch('http://beeapp-webgisapps.rhcloud.com/flowers')
                    .then(
                        function (response) {
                            if (response.status !== 200) {
                                console.log('Looks like there was a problem. Status Code: ' +
                                    response.status);
                                return;
                            }
                            // Examine the text in the response
                            response.json().then(function (data) {
                                allFlowers = data

                                console.log(allAreas)
                                console.log(allFlowers)

                                return [allFlowers, allAreas]
                            });
                        }
                    )
                    .catch(function (err) {
                        console.log('Fetch Error :-S', err);
                    });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function runSimulation (params, state) {
    var studyArea = params.choseArea
    var flowers = params.choseFlowers

    console.log(flowers)

    //INTERSECT study_area against parcels and calc total area
    var studyAreaGeomFeature = JSON.parse(studyArea[0].geom)

    var parcel = state.parsedGeoJSON
    var parcelFeatures = parcel.features

    console.log(parcelFeatures.length)

    var conflictlist = [];
    parcelFeatures.forEach( (feature) => {
        var conflict = Intersect(feature, studyAreaGeomFeature);
        if (conflict != null) {
            conflictlist.push(conflict);
        }
    });

    var intersectiontest = turf.featureCollection(conflictlist);

    var areaSqMeters = Area(intersectiontest)

    //Generate geometries for each plant based on the plant_radius
    let flowerResults = []
    flowers.forEach((flower) => {
      let flowersNumber = Math.floor((areaSqMeters * (flower.plant_placement/100)) / (flower.plant_radius * flower.plant_radius * Math.PI))
      let flowerScore = flowersNumber * flower.plant_index

      var obj = {}
      obj['name'] = flower.plant_name
      obj['number_flowers'] = flowersNumber
      obj['flower_score'] = flowerScore

      flowerResults.push(obj)
    })
    //Do some magic to get final score

    return [intersectiontest, areaSqMeters, flowerResults]
}

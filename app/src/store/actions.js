/**
 * Created by ricardooliveira on 2/26/17.
 */
import * as t from './action-types';
import store from './index';
import * as wellknown from 'wellknown';


export const addFlower = (flower) => {
    return {
        type: t.ADD_FLOWER,
        flower
    }
};

export const removeFlower = (flower) => {
    return {
        type: t.REMOVE_FLOWER,
        flower
    }
};

export const addArea = (area) => {
    return {
        type: t.ADD_AREA,
        area
    }
};

export const removeArea = (area) => {
    return {
        type: t.REMOVE_AREA,
        area
    }
};

export const updatePlacement = (id, val) => {
    return {
        type: t.UPDATE_PLACEMENT,
        update: {
            id: id,
            val: val
        }
    }
};

export const connectDatabase = (path) => {
    return {
        type: t.CONNECT_DATABASE,
        dbDataPath: path
    }
};

export const connectGeoJSON = (path) => {
    return {
        type: t.CONNECT_GEOJSON,
        geoJSONDataPath: path
    }
};

export const addFlowerDB = (newFlower) => {
    const newFlowerVals = newFlower

    return {
        type: t.ADD_FLOWER_DB,
        newFlowerVals
    }
};

export const removeFlowerDB = (flowerId) => {
    console.log('flower to be removed: ' + flowerId)

    return {
        type: t.REMOVE_FLOWER_DB,
        flowerId
    }
};

export const addAreaDB = (newArea) => {
    console.log('area to be added: ' + newArea)

    return {
        type: t.ADD_AREA_DB,
        newArea
    }
};

export const removeAreaDB = (areaId) => {
    console.log('area to be removed: ' + areaId)

    return {
        type: t.REMOVE_AREA_DB,
        areaId
    }
};

export const runSimulation = (params) => {
    console.log('running simulation for the following params:' + params)

    return {
        type: t.RUN_SIMULATION,
        params
    }
};

export const newRun = () => {
    console.log('Cleaning all for new run.')

    return {
        type: t.NEW_RUN
    }
};

export const chooseDBType = (dbType) => {
    console.log('Database choosed was:' + dbType)

    return {
        type: t.CHOOSE_DB_TYPE,
        dbType
    }
};

export const dataFetched = (data) => {

    return {
        type: t.CONNECT_DATABASE_CLOUD,
        data
    }
}

export const onError = (error) => {
    return {
        type: t.ON_ERROR,
        error
    }
}

export const connectDatabaseCloud = () => {
    console.log('Loading the Database from the cloud.')

    let allAreas,
        allFlowers

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

                                store.dispatch(dataFetched([allAreas, allFlowers]))

                            });
                        }
                    )
                    .catch(function (err) {
                        console.log('Fetch Error :-S', err);
                        store.dispatch(onError(err))
                    });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
            store.dispatch(onError(err))
        });
}

export const removeAreaDBCloud = (areaId) => {
    console.log('area to be removed: ' + areaId)

    fetch('http://beeapp-webgisapps.rhcloud.com/studyareas/' + areaId, {
        method: 'DELETE'
    }).then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            // Examine the text in the response
            response.json().then(function () {

                store.dispatch(connectDatabaseCloud())

            });
        }
    )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
};

export const addAreaDBCloud = (newArea) => {
    console.log('area to be added: ' + newArea)

    console.log(newArea)

    var payload = {};
    payload['newAreaNameVal'] = newArea.newAreaNameVal
    payload['newAreaDescriptionVal'] = newArea.newAreaDescriptionVal
    payload['newAreaGeomVal'] = wellknown.stringify((JSON.parse(newArea.newAreaGeomVal).geometry))

    fetch('http://beeapp-webgisapps.rhcloud.com/studyareas', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    }).then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            // Examine the text in the response
            response.json().then(function () {

                store.dispatch(connectDatabaseCloud())

            });
        }
    )
};

export const removeFlowerDBCloud = (flowerId) => {
    console.log('flower to be removed: ' + flowerId)

    fetch('http://beeapp-webgisapps.rhcloud.com/flowers/' + flowerId, {
        method: 'DELETE'
    }).then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            // Examine the text in the response
            response.json().then(function () {

                store.dispatch(connectDatabaseCloud())

            });
        }
    )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
};

export const addFlowerDBCloud = (newFlower) => {
    console.log('area to be added: ' + newFlower)

    console.log(newFlower)

    var payload = {};
    payload['newFlowerIndexVal'] = newFlower.newFlowerIndexVal
    payload['newFlowerNameVal'] = newFlower.newFlowerNameVal
    payload['newFlowerRadiusVal'] = newFlower.newFlowerRadiusVal

    fetch('http://beeapp-webgisapps.rhcloud.com/flowers', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    }).then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            // Examine the text in the response
            response.json().then(function () {

                store.dispatch(connectDatabaseCloud())

            });
        }
    )
};
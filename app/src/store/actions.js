/**
 * Created by ricardooliveira on 2/26/17.
 */
import * as t from './action-types';
import store from './index';
import * as wellknown from 'wellknown';


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

export const addAreaDB = (newArea) => {
    return {
        type: t.ADD_AREA_DB,
        newArea
    }
};

export const startedSimulation = () => {
    return {
        type: t.RUNNING_SIM
    }
}

export const parseResults = (results) => {
    return {
        type: t.PARSE_RESULTS,
        results
    }
};

export const runSimulation = (params) => {
    var payload = {};
    payload['hives_acre'] = params.hiveAcreVal
    payload['bees_hive'] = params.beeHiveVal
    payload['area_id'] = params.use_area

    store.dispatch(startedSimulation())

    fetch('http://beeapp-webgisapps.rhcloud.com/run_simulation', {
        method: 'POST',
        body: JSON.stringify(payload)
    }
    )
        .then(
            function (response) {
                response.json().then(function (data) {
                    // console.log(data)
                    console.log('got response!', Date.now())
                    store.dispatch(parseResults(data))
                    // store.dispatch(startedSimulation())
                })
            }
        )
        .catch(
        function (err) {
            console.log('Fetch Error :-S', err);
            store.dispatch(onError(err))
        });
};

export const newRun = () => {
    return {
        type: t.NEW_RUN
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
            store.dispatch(onError(err))
        });
};

export const addAreaDBCloud = (newArea) => {
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
    ).catch(function (err) {
        store.dispatch(onError(err));
    });
};
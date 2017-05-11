import * as t from '../action-types';

import * as sql from 'sql.js';
import Intersect from 'turf-intersect';
import Area from 'turf-area';
import * as turf from 'turf';

const initialData = {
    plants: [],
    study_areas: [],
    use_plants: [],
    use_area: [],
    intersected_polys: null,
    intersected_area: null,
    error_modal: false,
    running_modal: false
};

export default (state = initialData, action) => {
    switch (action.type) {
        case t.ADD_AREA:
            const newArea = state.study_areas.filter(o => o.area_id.toString() === action.area.toString())

            return {
                ...state,
                use_area: newArea
            };

        case t.CONNECT_DATABASE_CLOUD:
            let dbData = action.data
            let flowers = dbData[1]

            let study_areas = dbData[0]

            let allAreas = []
            study_areas.features.map((record) => {
                var obj = {}
                obj['area_id'] = record.properties.area_id
                obj['study_descr'] = record.properties.study_descr
                obj['study_area'] = record.properties.study_area
                obj['geom'] = JSON.stringify(record.geometry)
                allAreas.push(obj)
            })

            return {
                ...state,
                plants: flowers,
                study_areas: allAreas,
                use_plants: [],
                use_areas: []
            }

        case t.ON_ERROR:
            return {
                ...state,
                error_modal: true,
                error_msg: action.error.toString()
            };

        case t.RUNNING_SIM:
            return {
                ...state,
                running_modal: true
            }

        case t.PARSE_RESULTS:
            let results = JSON.parse(action.results)

            return{
                ...state,
                results: results,
                running_modal: false
            };

        case t.NEW_RUN:
            return{
                ...state,
                results: null,
                use_area: []
            };

        default:
            return state
    }
}



import * as actions from '../../store/actions'
import _ from 'lodash'

export const mapStateToProps = (state) => {
    const plants_list_arr = [];
    const areas_list_arr = [];

    state.data.plants.forEach((plant) =>
        plants_list_arr.push(plant)
    )

    state.data.study_areas.forEach((area) =>
        areas_list_arr.push(area)
    )

    const use_plants =  state.data.use_plants;
    const use_area = state.data.use_area;

    let num_intersected_polys = state.data.intersected_polys != null ? state.data.intersected_polys.features.length : null;

    let intersected_area = state.data.intersected_area != null ? state.data.intersected_area.toFixed(2) : null;

    let flowers_result = state.data.flowers_result != null ? state.data.flowers_result : null;

    let result_returned = state.data.intersected_area != null ? true : false;

    let dbType = state.data.dbType

    let error_msg = state.data.error_msg != null ? state.data.error_msg : null

    let error_modal = state.data.error_modal != null ? state.data.error_modal : null

    console.log(error_modal)
    return {
        plants_list: plants_list_arr,
        areas_list: areas_list_arr,
        use_plants,
        use_area,
        result_returned,
        num_intersected_polys,
        intersected_area,
        flowers_result,
        dbType,
        error_msg,
        error_modal
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        toggleFlower: (e) => {
            const flower = e.target.id;
            //TODO: alter logic so it doens't depend on the e.target.checked to decide which action to dispatch
            dispatch(e.target.checked ? actions.addFlower(flower) : actions.removeFlower(flower))
        },

        toggleArea: (e) => {
            const area = e.target.id;
            dispatch(e.target.checked ? actions.addArea(area) : actions.removeArea(area))
        },

        updateFlowerPlacement: (val, id) => {
            dispatch(actions.updatePlacement(val, id))
        },

        loadDBFromDisk: (path) => {
            dispatch(actions.connectDatabase(path))
        },

        loadGeoJSONFromDisk: (path) => {
            dispatch(actions.connectGeoJSON(path))
        },

        addNewFlowerDB: (newFlower) => {
          dispatch(actions.addFlowerDB(newFlower))
        },

        removeFlowerDB: (flowerID) => {
          dispatch(actions.removeFlowerDB(flowerID))
        },

        addNewAreaDB: (newArea) => {
          dispatch(actions.addAreaDB(newArea))
        },

        removeAreaDB: (areaID) => {
            dispatch(actions.removeAreaDB(areaID))
        },

        runSimulation: (params) => {
            dispatch(actions.runSimulation(params))
        },

        newRun: () => {
            dispatch(actions.newRun())
        },

        chooseDBType: (dbType) => {
            dispatch(actions.chooseDBType(dbType))
        },

        loadDBFromCloud: () => {
            dispatch(actions.connectDatabaseCloud())
        },

        removeAreaDBCloud: (areaID) => {
            dispatch(actions.removeAreaDBCloud(areaID))
        },

        removeFlowerDBCloud: (flowerID) => {
            dispatch(actions.removeFlowerDBCloud(flowerID))
        },

        addNewFlowerDBCloud: (newFlower) => {
            dispatch(actions.addFlowerDBCloud(newFlower))
        },
    }
}

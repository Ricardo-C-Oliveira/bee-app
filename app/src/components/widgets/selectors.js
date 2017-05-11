import * as actions from '../../store/actions'

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

    let results = state.data.results != null ? state.data.results : null

    let error_msg = state.data.error_msg != null ? state.data.error_msg : null

    let error_modal = state.data.error_modal != null ? state.data.error_modal : null

    let running_modal = state.data.running_modal != null ? state.data.running_modal : null

    return {
        plants_list: plants_list_arr,
        areas_list: areas_list_arr,
        use_plants,
        use_area,
        results,
        error_msg,
        error_modal,
        running_modal
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        toggleArea: (e) => {
            const area = e.target.id;
            dispatch(e.target.checked ? actions.addArea(area) : actions.removeArea(area))
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

        loadDBFromCloud: () => {
            dispatch(actions.connectDatabaseCloud())
        },

        removeAreaDBCloud: (areaID) => {
            dispatch(actions.removeAreaDBCloud(areaID))
        }

    }
}

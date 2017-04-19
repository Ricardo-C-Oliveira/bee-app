// import * as actions from '../../store/actions'
import * as actions from '../../store/actions'


export const mapStateToProps = (state) => {
    const data = state.data;
    const use_area = data.use_area;
    const intersected_polys = data.intersected_polys;
    const dbType = state.data.dbType

    return {
        use_area,
        intersected_polys,
        dbType
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        addNewAreaDB: (newArea) => {
          dispatch(actions.addAreaDB(newArea))
        },

        addNewAreaDBCloud: (newArea) => {
            dispatch(actions.addAreaDBCloud(newArea))
        }

    }
}

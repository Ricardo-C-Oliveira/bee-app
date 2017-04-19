import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './rootReducer';
// import { composeWithDevTools } from 'remote-redux-devtools'


const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware)
    );

export default store;

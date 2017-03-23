/**
 * Created by ricardooliveira on 2/26/17.
 */
import * as t from './action-types';

import * as sql from 'sql.js';

const electron = window.require('electron');
const fs = electron.remote.require('fs');


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

export const updatePlacement = (id, val) => {
    return {
        type: t.UPDATE_PLACEMENT,
        update: {
            id: id,
            val: val
        }
    }
}

export const connectDatabase = (path) => {
    return {
        type: t.CONNECT_DATABASE,
        dbDataPath: path
    }
}

export const addFlowerDB = (newFlower) => {
    const newFlowerVals = newFlower

    return {
        type: t.ADD_FLOWER_DB,
        newFlowerVals
    }
}

export const removeFlowerDB = (flowerId) => {
    console.log('flower to be removed: ' + flowerId)

    return {
        type: t.REMOVE_FLOWER_DB,
        flowerId
    }
}

export const addAreaDB = (newArea) => {
    console.log('area to be added: ' + newArea)

    return {
        type: t.ADD_AREA_DB,
        newArea
    }
}

export const removeAreaDB = (areaId) => {
    console.log('area to be removed: ' + areaId)

    return {
        type: t.REMOVE_AREA_DB,
        areaId
    }
}
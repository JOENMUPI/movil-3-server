const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesConnect = require('../config/queries/connect');
const jwt = require('jsonwebtoken');

// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToConnects = (rows, id) => {
    const connects = [];
        
    rows.forEach(element => {
        if(element.user_ide != id) { 
            let aux = {
                userObj:  element.user_user_ide,
                petitionState: element.connect_pet_flg,
                img: element.user_img,
                id: element.user_ide,
                name: element.user_nam,
                lastName: element.user_las_nam
            }

            if(aux.img != null) {
             aux.img = aux.img.toString();
            }

            connects.push(aux);
        }
    });

    return connects;
}


// Logic
const getConnects = async (req, res) => {
    const token = req.headers['x-access-token'];

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));
    
    } else { 
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET);
        const dataConnect = await pool.query(dbQueriesConnect.getConnectsByUserId, [ tokenDecoded.id ]);
         
        if(!dataConnect) {
            res.json(newReponse('Error searching post', 'Error', {})); 

        } else {
            res.json(newReponse('All connects', 'Success', dataToConnects(dataConnect.rows, tokenDecoded.id))); 
        }
    }
}

const createConnect = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { userObjId } = req.body;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ tokenDecoded.id, userObjId, false  ];
        const data = await pool.query(dbQueriesConnect.createConnect, arrAux);
        
        (data)
        ? res.json(newReponse('Send connect', 'Success', { }))
        : res.json(newReponse('Error create connect', 'Error', { }));  
    }
}

const ConfirmConnect = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { id } = req.body;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ id, tokenDecoded.id ]; 
        const data = await pool.query(dbQueriesConnect.updateConnectsById, arrAux);
        
        (data)
        ? res.json(newReponse('Connect checked', 'Success', { }))
        : res.json(newReponse('Error confirm connect', 'Error', { }));  
    }
}

const deleteConnect = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { userObjId } = req.params; 

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        const arrAux = [ userObjId, tokenDecoded.id ]; 
        const data = await pool.query(dbQueriesConnect.deleteConnectById, arrAux);
        
        (data)
        ? res.json(newReponse('Delete connect successfully', 'Success', { }))
        : res.json(newReponse('Error delete connect', 'Error', { }));  
    }
}

// Export
module.exports = { 
    getConnects,
    createConnect,
    ConfirmConnect,
    deleteConnect
}
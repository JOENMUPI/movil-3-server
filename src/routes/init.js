const router = require('express').Router();
const dbConfig = require('../config/db_config');
const Pool = require('pg').Pool;


// Variables
const endPoint = '/init';

// Get
router.get(endPoint, async (req, res) => {
    const pool = new Pool(dbConfig);  
    const universityData = await pool.query('SELECT * FROM university');
    const qualificationData = await pool.query('SELECT * FROM qualification');
    
    if(universityData && qualificationData) {
        for(let i = 0; i < universityData.rowCount; i++) {
            for(let j  = 0; j < qualificationData.rowCount; j++) {
                const arrAux = [ universityData.rows[i].university_ide, qualificationData.rows[j].qualification_ide ];
                await pool.query('INSERT INTO university_qualification (university_ide, qualification_ide) VALUES ($1, $2) ', arrAux);
            }
        }
    }

    res.json({ message: 'Ready', typeResponse: 'Success' });
});


// Post



// Put



// Delete



// Export
module.exports = router;
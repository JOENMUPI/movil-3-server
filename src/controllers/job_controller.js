const Pool = require('pg').Pool;
const dbConfig = require('../config/db_config');
const dbQueriesJob = require('../config/queries/job');
const jwt = require('jsonwebtoken');


// Variables
const pool = new Pool(dbConfig);


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToJobs = (rows) => {
    const jobs = [];
        
    rows.forEach(element => {
        jobs.push({  
            id: element.job_ide,
            description: element.job_des
        });
    });

    return jobs;
}

// Logic
const createJob = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { description, enterpriseId } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const data = await pool.query(dbQueriesJob.createJob, [ description, enterpriseId ]);
        
        (data)
        ? res.json(newReponse('Job created', 'Success', dataToJobs(data.rows)[0]))
        : res.json(newReponse('Error create job', 'Error', { }));
    }
}

const updatejobById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { description, id } = req.body;
    
    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const data = await pool.query(dbQueriesJob.updateJobById, [ description, id ]);
        
        (data)
        ? res.json(newReponse('job updated', 'Success', { }))
        : res.json(newReponse('Error on update job', 'Error', { }));
    }
}

const deleteJobById = async (req, res) => {
    const token = req.headers['x-access-token'];
    const { jobId } = req.params;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));
    
    } else {
        const data = await pool.query(dbQueriesJob.deleteJobById, [ jobId ]);

        (data)
        ? res.json(newReponse('Detele job successfully', 'Success', { }))
        : res.json(newReponse('Error on delete with id', 'Error', { }));
    }
}

// Export
module.exports = { 
    createJob,
    updatejobById,
    deleteJobById
}
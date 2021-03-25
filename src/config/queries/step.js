const table = 'step';

module.exports = {
    // Insert
    createStep: `INSERT INTO ${ table } (step_des, step_che, task_ide) VALUES ($1, $2, $3) 
    RETURNING step_ide`,
    
    
    // Select
    getAllSteps: `SELECT * FROM ${ table }`,
    getStepById: `SELECT * FROM ${ table } WHERE step_ide = $1`,
    getStepByTaskId: `SELECT * FROM ${ table } WHERE task_ide = $1`,
    getStepByDescription: `SELECT * FROM ${ table } WHERE step_des = $1`,
    
    
    // Update
    updateStepDescriptionById: `UPDATE ${ table } SET step_des = $1 WHERE step_ide = $2`,
    updateStepCheckById: `UPDATE ${ table } SET step_che = $1 WHERE step_ide = $2`,
    updateStepById: `UPDATE ${ table } SET step_des = $1, step_che = $2 WHERE step_ide = $3`,
    

    // Delete
    deleteStepById: `DELETE FROM ${ table } WHERE step_ide = $1`
};
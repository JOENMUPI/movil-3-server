const table = 'task';

module.exports = {
    // Insert
    createTask: `INSERT INTO ${ table } 
    (task_tit, task_pin, task_che, task_dat_cre, task_pos, list_ide) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING task_ide`,
    
    
    // Select
    getAllTasks: `SELECT * FROM ${ table }`,
    getTaskById: `SELECT * FROM ${ table } WHERE task_ide = $1`,
    getTaskByListId: `SELECT * FROM ${ table } WHERE list_ide = $1`,
    
    
    // Update
    updateTaskTittleById: `UPDATE ${ table } SET task_tit = $1 WHERE task_ide = $2`,
    updateTaskNoteById: `UPDATE ${ table } SET task_des = $1 WHERE task_ide = $2`,
    updateTaskDateExpById: `UPDATE ${ table } SET task_dat_exp = $1 WHERE task_ide = $2`,
    updateTaskDateNotificationById: `UPDATE ${ table } SET task_dat_not = $1 WHERE task_ide = $2`,
    updateTaskPriorityExpById: `UPDATE ${ table } SET task_pin = $1 WHERE task_ide = $2`,
    updateTaskCheckExpById: `UPDATE ${ table } SET task_che = $1 WHERE task_ide = $2`,

    // Delete
    deleteTaskById: `DELETE FROM ${ table } WHERE task_ide = $1`
};
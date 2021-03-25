const table = 'list';

module.exports = {
    // Insert
    createList: `INSERT INTO ${ table } (list_tit, list_img, user_ide) VALUES ($1, $2, $3)
    RETURNING list_ide`,
    
    
    // Select
    getAllList: `SELECT * FROM ${ table }`,
    getListById: `SELECT * FROM ${ table } WHERE list_ide = $1`,
    getListByUserId: `SELECT * FROM ${ table } WHERE user_ide = $1`,
    
    
    // Update

    updateListById: `UPDATE ${ table } SET list_tit = $1, list_img = $2 WHERE list_ide = $3`,
    updateTittleListById: `UPDATE ${ table } SET list_tit = $1 WHERE list_ide = $2`,
    updateImgListById: `UPDATE ${ table } SET list_img = $1 WHERE list_ide = $2`,


    // Delete
    deleteListById: `DELETE FROM ${ table } WHERE List_ide = $1`
};
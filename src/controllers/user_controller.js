const Pool = require('pg').Pool;
const bcryt = require('bcryptjs');
const dbConfig = require('../config/db_config');
const twilioConfig = require('../config/twilio_config');
const twilioClient = require('twilio')(twilioConfig.sid, twilioConfig.token)
const dbQueriesUser = require('../config/queries/user');
const dbQueriesQualifications = require('../config/queries/user_qualification');
const dbQueriesIdiom = require('../config/queries/user_language');
const dbQueriesPost = require('../config/queries/post');
const dbQueriesReaction = require('../config/queries/reaction');
const dbQueriesPostReaction = require('../config/queries/post_reaction');
const dbQueriesComment = require('../config/queries/comment');
const dbQueriesConnect = require('../config/queries/connect');
const passwordUtil = require('../utilities/password');
const field = require('../utilities/field');
const jwt = require('jsonwebtoken');
const timeAgo = require('timeago.js');


// Variables
const pool = new Pool(dbConfig);  


// Utilities
const newReponse = (message, typeResponse, body) => {
    return {  message, typeResponse, body }
}

const dataToUser = (rows) => {
    const users = [];
        
    rows.forEach(element => {
        let user = {  
            description: element.user_des,
            name: element.user_nam,
            lastName: element.user_las_nam,
            country: element.country_nam,
            dateCreation: element.user_dat_cre,
            img: element.user_img,
            email: element.user_ema,
            awards: element.user_awa_jso,
            interest: element.user_int_jso,
            skills: element.user_ski_jso,
            id: element.user_ide
        }
         
        if(user.img != null) {
            user.img = user.img.toString();
        }

        (user.skills == null)
        ? user.skills = []
        : user.skills = user.skills.data;
        
        (user.interest == null)
        ? user.interest = []
        : user.interest = user.interest.data;
        
        (user.awards == null)
        ? user.awards = []
        : user.awards = user.awards.data;

        users.push(user);
    });
    
    return users;
}

const dataToQualifications = (rows) => {
    const qualifications = [];
    
    rows.forEach(element => {
        qualifications.push({  
            dateEnd: element.user_qualification_dat_end,
            dateInit: element.user_qualification_dat_cre,
            img: element.university_img,
            university: element.university_nam,
            qualification: qualification_nam,
        });
    });

    return qualifications;
}

const dataToLanguage = (rows) => {
    const idioms = [];

    rows.forEach(element => {
        idioms.push({  
            lvl: element.user_language_lvl,
            name: element.language_nam
        });
    });

    return idioms;
}

const dataToReactions = (reaction) => {
    return {
        type: reaction.reaction_des,
        num: reaction.count
    }
}

const dataToPost = (post, reactions, commentaries) => { 
    let jsonAux = {
        tittle: post.post_tit,
        description: post.post_des,
        dateCreation: timeAgo.format(post.post_dat_cre),
        dateEdit: post.post_dat_edi,
        img: post.post_img,
        id: post.post_ide, 
        connectFlag: post.post_onl_con,
        commentFlag: post.post_com,
        commentaries,
        reactions    
    }

    if(jsonAux.img != null) {
        jsonAux = { ...jsonAux, img: jsonAux.img.toString() }
    }

    if(jsonAux.dateEdit != null) {
        jsonAux = { ...jsonAux, dateEdit: timeAgo.format(jsonAux.dateEdit) } 
    }

    return jsonAux
}

const sms = async (phoneNumber, code) => {  
    const jsonAux = {
        body: `Your FakedIn's code verification is ${code}`,
        from: twilioConfig.phone,
        to: phoneNumber  
    } 
    
    await twilioClient.messages.create(jsonAux);
}

const checkAux = async (fieldData, type, callBack) => { 
    let data;

    switch(type) {
        case 'email':
            data = await pool.query(dbQueriesUser.getUserByEmail, [ fieldData ]);
            break;

        case 'number': 
            data = await pool.query(dbQueriesUser.getUserByNumber, [ fieldData ]);  
            break;

        default:
            return callBack('Error on type-checkAux')
    }
    
    if(data) {
        if(data.rows.length > 0) {
            return callBack(null, dataToUser(data.rows));
        
        } else {
            return callBack(null, null);
        }    

    } else {
        return callBack('Error on query');
    }
}

// Logic
const checkNum = (req, res) => {  
    const { phoneNumber } = req.body; 

    checkAux(phoneNumber, 'number', (err, users) => { 
        if(err) {
            res.json(newReponse(err, 'Error', { }));
            
        } else if(users) { 
            res.json(newReponse(`Number ${ phoneNumber } already use`, 'Error', { }));
            
        } else {   
            const randomCode = Math.floor(Math.random() * (10000 - 1000)) + 1000;
            const tokenBody = { phoneNumber: phoneNumber, code: randomCode };            
            const token = jwt.sign(tokenBody, process.env.SECRET, { expiresIn: '1h' });
            
            sms(phoneNumber, randomCode);
            res.json(newReponse('Phone number checked', 'Success', { token }));
        } 
    });
}

const checkCode = (req, res) => { 
    const token = req.headers['x-access-token'];
    const { code, phoneNumber } = req.body;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const tokenDeco = jwt.verify(token, process.env.SECRET);
        
        if(tokenDeco.phoneNumber != phoneNumber) {
            res.json(newReponse('phone number not match', 'Error', { }))  
        
        } else {
            (tokenDeco.code != code)
            ? res.json(newReponse('Wrong code', 'Error', { }))
            : res.json(newReponse('Code checked', 'Success', { }));
        }
    }
}

const checkEmail = (req, res) => {
    const { email } = req.body;

    checkAux(email, 'email', (err, users) => {
        if(err) {
            res.json(newReponse(err, 'Error', { }));
            
        } else if(users) {
            res.json(newReponse(`Email ${ email } already use`, 'Error', { }));
            
        } else {    
            res.json(newReponse('Email checked', 'Success', { }));
        }
    });
}

const login = async (req, res) => { 
    const { email, password } = req.body; 
    const data = await pool.query(dbQueriesUser.getUserByEmail, [ email ]);
    
    if(data) { 
        if(data.rowCount > 0) {  
            let { img, interests, skills, awards, ...user } = dataToUser(data.rows)[0]; 
            const token = jwt.sign(user, process.env.SECRET, { expiresIn: '12h' }); 
            
            user = JSON.stringify({ ...user, interests, skills, awards, img }); 
            (await bcryt.compare(password, data.rows[0].user_pas)) 
            ? res.json(newReponse('Logged successfully', 'Success', { token, user }))
            : res.json(newReponse('Incorrect password', 'Error', { }));
        
        } else {
            res.json(newReponse('Email not found', 'Error', { })); 
        }

    } else {
        res.json(newReponse('Error searching user with email', 'Error', { }));
    }
}

const getUser = async (req, res) => { 
    const data = await pool.query(dbQueriesUser.getAllUsers);
    
    if (data) {
        (data.rowCount > 0)
        ? res.json(newReponse('All users', 'Success', dataToUser(data.rows)))
        : res.json(newReponse('Error searhing the users', 'Error', { }));
    
    } else { 
        res.json(newReponse('Without users', 'Success', { }));
    }
}

const getUserById = async (req, res) => {  /////// falta getear las experiencias
    const token = req.headers['x-access-token'];
    const { userId } = req.params; 

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        let dataUser = await pool.query(dbQueriesUser.getUserById, [ userId ]);
        
        (dataUser.rowCount > 0) 
        ? dataUser = dataToUser(dataUser.rows)[0]
        : res.json(newReponse('User not found', 'Error', { }));
        
        if(dataUser) {  
            const dataPost = await pool.query(dbQueriesPost.getPostByUserIdOnUser, [ dataUser.id ]);
            let dataQualification = await pool.query(dbQueriesQualifications.getQualificationByUserId, [ dataUser.id ]); 
            let dataIdioms = await pool.query(dbQueriesIdiom.getIdiomsByUserId, [ dataUser.id ]);
            let dataMyConnect = await pool.query(dbQueriesConnect.checkMyconnect, [ dataUser.id, tokenDecoded.id ]);
            let dataConnectNum = await pool.query(dbQueriesConnect.getNumConnectsByUserId, [ dataUser.id ]);
            
            
            let postsAux = [];

            if(dataConnectNum) {
                (dataConnectNum.rowCount > 0) 
                ? dataConnectNum = dataConnectNum.rows[0].count
                : dataConnectNum = 0;
            }

            (dataMyConnect.rowCount > 0)
            ? dataMyConnect = true
            : dataMyConnect = false;
            
            (dataQualification)
            ? dataQualification = dataToQualifications(dataQualification.rows) 
            : dataQualification = [];

            (dataIdioms) 
            ? dataIdioms = dataToLanguage(dataIdioms.rows)
            : dataIdioms = [];

            if (dataPost) {
                const allReactions = await pool.query(dbQueriesReaction.getAllReactions);
                let allReactionsAux  = [];
    
                if (allReactions) {
                    allReactions.rows.forEach(reaction => {
                        allReactionsAux.push({ description: reaction.reaction_des, id: reaction.reaction_ide , num: 0, me: false });
                    });
                } 
    
                for(let i = 0; i < dataPost.rowCount; i++) { 
                    const reactionPost = await pool.query(dbQueriesPostReaction.getReactionsByPostId, [ dataPost.rows[i].post_ide ]);
                    const comentaries = await pool.query(dbQueriesComment.getNumCommentByPostId, [ dataPost.rows[i].post_ide ]);
                    let reactions = allReactionsAux;
    
                    if(reactionPost) {
                        reactionPost.rows.forEach(item => {
                            reactions = reactions.map(reaction => { 
                                let aux = reaction; 
                                
                                if(reaction.id == item.reaction_ide) { 
                                    (item.user_ide == tokenDecoded.id)  
                                    ? aux = { ...aux, num: reaction.num + 1, me: true }
                                    : aux = { ...aux, num: reaction.num + 1 }
                                }
    
                                return aux;
                            });
                        });
                    }
                                                                
                    postsAux.push(dataToPost(dataPost.rows[i], reactions, comentaries.rows[0].count)); 
                }
            }
                console.log('myConnect', dataMyConnect);
                console.log('connectNum', dataConnectNum);
            const user = { 
                ...dataUser, 
                connectNum: dataConnectNum,
                myConnect: dataMyConnect,
                activities: postsAux,
                qualifications: dataQualification,  
                idioms: dataIdioms,
                experiences: []
            } 

            res.json(newReponse('User found', 'Success', user)); 
           
        } else {
            res.json(newReponse('Error searching user with id', 'Error', { }));
        }    
    }
}

const createUsers =  (req, res) => {   
    const { name, password, lastName, email, country, phoneNumber, img } = req.body;
    
    passwordUtil.encryptPass(password, async(err, passHash) => { 
        if(err) {
            res.json(newReponse(err, 'Error', { }));
            
        } else { 
            const arrAux = [ new Date(), name, lastName, email, passHash, phoneNumber, country.id, img ];
            const data = await pool.query(dbQueriesUser.createUser, arrAux);
            
            (data)
            ? res.json(newReponse('User created', 'Success', { }))
            : res.json(newReponse('Error create user', 'Error', { }));
        }
    });
}

const updateFieldById = async (req, res) => { 
    const token = req.headers['x-access-token'];
    const { field } = req.params;

    if(!token) {
        res.json(newReponse('User dont have a token', 'Error', { }));

    } else {
        const { iat, exp, ...tokenDecoded } = jwt.verify(token, process.env.SECRET); 
        let data;
        
        switch(field) {
            case 'skill':
                data = await pool.query(dbQueriesUser.updateSkillById, [ req.body, tokenDecoded.id ]);
                break;
            case 'interest':
                data = await pool.query(dbQueriesUser.updateInterestById, [ req.body, tokenDecoded.id ]);
                break;
        }

        (data)
        ? res.json(newReponse('Updated successfully', 'Success', { }))
        : res.json(newReponse('Error on skill (PUT)', 'Error', { }));
    }
}

const updateUserById = (req, res) => {
    const { name, email } = req.body;
    const { userId } = req.params;
    const errors = [];

    if(!field.checkFields([ name, email ])) {
        errors.push({ text: 'Please fill in all the spaces' });
    } 
    
    if(errors.length > 0) {
        res.json(newReponse('Errors detected', 'Fail', { errors }));
    
    } else {
        checkAux(email, 'email', async (err, users) => {
            if(err) {
                res.json(newReponse(err, 'Error', { }));
            
            } else if(!users) {
                res.json(newReponse('User not found', 'Error', { }));
                
            } else {
                if(users[0].id != userId) {
                    res.json(newReponse(`Email ${ email } already use`, 'Error', { }));
                    
                } else {   
                    const data = await pool.query(dbQueriesUser.updateUserById, [ name, email, userId ]);
                
                    (data)
                    ? res.json(newReponse('User updated', 'Success', { }))
                    : res.json(newReponse('Error on update', 'Error', { }));
                }
            }        
        });       
    }
}


const updatePassById = async (req, res) => { 
    const { password, confirmPassword, oldPassword } = req.body;
    const { userId } = req.params;
    const errors = [];
    
    if(!field.checkFields([ password, confirmPassword, oldPassword, userId ])) { 
        errors.push({ text: 'Please fill in all the spaces' });
    } 
    
    if(!passwordUtil.checkPass(password, confirmPassword)) { 
        errors.push({ text: 'passwords must be uppercase, lowercase, special characters, have more than 8 digits and match each other'});
    
    } 
    
    if(errors.length > 0) {
        res.json(newReponse('Errors detected', 'Fail', { errors }));
    
    } else {
        const user = await pool.query(dbQueriesUser.getUserById, [ userId ]);

        if(user) {
            if(user.rowCount <= 0) {
                res.json(newReponse('User not found', 'Error', { })); 
            
            } else {
                if(await bcryt.compare(oldPassword, user.rows[0].user_pas)) {
                    passwordUtil.encryptPass(password, async (err, hash) => { 
                        if(err) { 
                            res.json(newReponse(err, 'Error', { }));
             
                        } else {
                            const data = await pool.query(dbQueriesUser.updatePassById, [ hash, userId ]);
                            
                            (data) 
                            ? res.json(newReponse('Pass updated', 'Success', { }))
                            : res.json(newReponse('Error on update', 'Error', { }));
                        }
                    });

                } else {
                    res.json(newReponse('Old password no match', 'Error', { }));
                }
            }

        } else {
            res.json(newReponse('Error searshing user', 'Error', { }))
        }        
    }
}


// Export
module.exports = { 
    checkNum,
    checkEmail,
    checkCode,
    login,
    getUser, 
    createUsers, 
    getUserById,
    updateUserById,
    updatePassById,
    updateFieldById,
}
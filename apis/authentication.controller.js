const common = require('../common');
const authentication = require('../models/authentication.model');
const authToken = require('../models/authtoken.model');

exports.authenticateUser = function(request, response) {
    try {
        const reqBody = request.body;
        let respData = {};
        const query = { $and: [{ username: reqBody.username }, { password: reqBody.password }] };
        console.log(query);
        const project = { username: 1, role: 1 };

        authentication.findOne(query, project).lean().exec((err, result) => {
            if (err) {
                console.error(err);
                respData = { message: 'error validating credentials in db.' };
                response.status(500).send(respData);
            } else {
                if (result) {
                    request.role = result.role;
                    result.jwt = common.generateToken(request);
                    respData = { data: result, message: "Login Successful" };
                    const query = { username: result.username };
                    const update = { $currentDate: { date_created: true }, $set: { auth_token: result.jwt }, $setOnInsert: { user_id: result._id, username: result.username } };
                    const options = { multi: false, upsert: true };
                    authToken.updateOne(query, update, options).exec((err, result) => {
                        if (err) {
                            console.error(err);
                            respData = { message: 'error storing auth token in db.' };
                            response.status(500).send(respData);
                        } else {
                            console.log(result);
                            response.status(200).send(respData);
                        }
                    });
                } else {
                    respData = { message: "Invalid Credentials" };
                    response.status(401).send(respData);
                }
            }
        });
    } catch (err) {
        console.error(err);
        respData = { message: 'something went wrong.' };
        response.status(500).send(respData);
    }
}


exports.invalidateAuthToken = function(request, response) {
    try {
        const token = request.header('x-auth-token');
        const loginusername = request.header('loginusername');
        let respData = {};

        if (!token) {
            respData = { message: 'No Token Provided.' };
            response.status(403).send(respData);
        } else {
            if (common.isEmpty(loginusername)) {
                respData = { message: 'Bad Request.' };
                response.status(400).send(respData);
            } else {
                common.verifyToken(request, (validity) => {
                    if (validity) {
                        const tokenQuery = { $and: [{ auth_token: token }, { username: loginusername }] };
                        authToken.findOne(tokenQuery).exec((err, result) => {
                            if (err) {
                                console.error(err);
                                respData = { message: 'error validating token in db.' };
                                response.status(500).send(respData);
                            } else {
                                if (result) {
                                    const query = { username: loginusername };
                                    authToken.deleteOne(query).exec((err, result) => {
                                        if (err) {
                                            console.error(err);
                                            respData = { message: 'error invalidating token from db.' };
                                            response.status(500).send(respData);
                                        } else {
                                            respData = { message: 'Token Invalidated Successfully.' };
                                            response.status(200).send(respData);
                                        }
                                    });
                                } else {
                                    respData = { message: 'Invalid Token For User.' };
                                    response.status(401).send(respData);
                                }
                            }
                        })
                    } else {
                        respData = { message: 'Invalid Token.' };
                        response.status(403).send(respData);
                    }
                });
            }
        }
    } catch (err) {
        console.error(err);
        respData = { message: 'something went wrong.' };
        response.status(500).send(respData);
    }
}
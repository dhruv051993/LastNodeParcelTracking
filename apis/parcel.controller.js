const common = require('../common');
const authToken = require('../models/authtoken.model');
const parcel = require('../models/parcel.model');

exports.getDeliveryDetailsAdmin = function(request, response) {
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
                                    parcel.find().exec((err, result) => {
                                        if (err) {
                                            console.error(err);
                                            respData = { message: 'error fetching delivery data from db.' };
                                            response.status(500).send(respData);
                                        } else {
                                            respData = { delivery_data: result, message: "Parcel List For Delivery Fetched" };
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
        console.log(err);
        respData = { message: 'Something Went Wrong.' };
        response.status(500).send(respData);
    }
}


exports.getParcelDetailsUser = function(request, response) {
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
                                    const project = { user_id: 0 };
                                    parcel.find(query, project).exec((err, result) => {
                                        if (err) {
                                            console.error(err);
                                            respData = { message: 'error fetching user parcel data from db.' };
                                            response.status(500).send(respData);
                                        } else {
                                            respData = { parcel_data: result, message: "Parcel List For User Fetched." };
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
        console.log(err);
        respData = { message: 'Something Went Wrong.' }
        response.status(500).send(respData);
    }
}

exports.changeDeliveryStatus = function(request, response) {
    try {
        const token = request.header('x-auth-token');
        const loginusername = request.header('loginusername');
        const itemId = request.body['itm_id'];
        const dlvryStatus = request.body['dlvry_status'];
        let respData = {};
        console.log(request);
        console.log(token);
        if (!token) {
            respData = { message: 'No Token Provided.' };
            response.status(403).send(respData);
        } else {
            if (common.isEmpty(loginusername) || common.isEmpty(itemId) || common.isEmpty(dlvryStatus)) {
                respData = { message: 'Bad Request.' };
                response.status(400).send(respData);
            } else {
                common.verifyToken(request, (validity) => {
                    if (validity && validity.data.role == 'admin') {
                        const tokenQuery = { $and: [{ auth_token: token }, { username: loginusername }] };
                        authToken.findOne(tokenQuery).exec((err, result) => {
                            if (err) {
                                console.error(err);
                                respData = { message: 'error validating token in db.' };
                                response.status(500).send(respData);
                            } else {
                                if (result) {
                                    const query = { _id: itemId };
                                    const update = { $set: { dlvry_status: dlvryStatus } };
                                    const options = { multi: false, upsert: false };
                                    parcel.findOneAndUpdate(query, update, options, (err, result) => {
                                        if (err) {
                                            console.error("error");
                                            respData = { message: 'error updating delivery status in db.' };
                                            response.status(500).send(respData);
                                        } else {
                                            if (result) {
                                                parcel.find().exec((err, result) => {
                                                    if (err) {
                                                        console.error(err);
                                                        respData = { message: 'error fetching delivery data from db.' };
                                                        response.status(500).send(respData);
                                                    } else {
                                                        respData = { delivery_data: result, message: "Parcel List For Delivery Fetched" };
                                                        response.status(200).send(respData);
                                                    }
                                                });
                                                // respData = { message: 'Delivery Status Updated Successfully.', statuscode: 200 }
                                                // response.status(200).send(respData);
                                            } else {
                                                respData = { message: "Item not found. Invalid Item Id.", statuscode: 404 }
                                                response.status(200).send(respData);
                                            }
                                        }
                                    });
                                } else {
                                    respData = { message: 'Invalid Token For User.' };
                                    response.status(401).send(respData);
                                }
                            }
                        })
                    } else if (validity && validity.data.role != 'admin') {
                        respData = { message: 'Only admin can update delivery status.' };
                        response.status(405).send(respData);
                    } else {
                        respData = { message: 'Invalid Token.' };
                        response.status(403).send(respData);
                    }
                });
            }
        }
        // deliveryMock.forEach(elm => {
        //     if (elm.itm_id == reqBody.itm_id) {
        //         elm['dlvry_status'] = reqBody.dlvry_status;
        //         respData = { message: 'Delivery Status Updated Successfully.', status: 200 }
        //     }
        // });
        // if (respData.status == 200) {
        //     response.status(200).send(respData);
        // } else {
        //     respData = { message: "Item not found. Invalid Item Id.", status: 404 }
        //     response.status(200).send(respData);
        // }
    } catch (err) {
        console.log(err);
        respData = { message: 'Something Went Wrong.' }
        response.status(500).send(respData);
    }
}
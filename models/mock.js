const mock = {};

mock.auth_mock = {
    auth_data: [
        { username: "admin", password: "admin", role: "admin" },
        { username: "user", password: "user", role: "user" }
    ]
};

mock.delivery_mock = {
    delivery_data: [
        { itm_name: "Item1", dlvry_date: "2019-04-25", dlvry_status: "out for delivery", user_id: "5cc55b0f115b7dc51cd77d56", dlvry_addr: "hinjewadi phase1" },
        { itm_name: "Item2", dlvry_date: "2019-04-25", dlvry_status: "out for delivery", user_id: "5cc55b1a115b7dc51cd77d5b", dlvry_addr: "hinjewadi phase2" },
        { itm_name: "Item3", dlvry_date: "2019-04-26", dlvry_status: "out for delivery", user_id: "5cc55b0f115b7dc51cd77d56", dlvry_addr: "hinjewadi phase3" },
        { itm_name: "Item4", dlvry_date: "2019-04-26", dlvry_status: "out for delivery", user_id: "5cc55b0f115b7dc51cd77d56", dlvry_addr: "wakad" },
        { itm_name: "Item5", dlvry_date: "2019-04-28", dlvry_status: "out for delivery", user_id: "5cc55b0f115b7dc51cd77d56", dlvry_addr: "wakad" },
        { itm_name: "Item6", dlvry_date: "2019-04-27", dlvry_status: "out for delivery", user_id: "5cc55b1a115b7dc51cd77d5b", dlvry_addr: "pimpri chinchwad" },
        { itm_name: "Item7", dlvry_date: "2019-04-28", dlvry_status: "out for delivery", user_id: "5cc55b1a115b7dc51cd77d5b", dlvry_addr: "pimple saudagar" },
        { itm_name: "Item8", dlvry_date: "2019-04-28", dlvry_status: "out for delivery", user_id: "5cc55b0f115b7dc51cd77d56", dlvry_addr: "wakad" },
    ]
};

mock.parcel_mock = {
    parcel_data: [
        { itm_id: 'itm1004', itm_name: "Item4", dlvry_date: "2019-04-26", dlvry_status: "out for delivery", dlvry_addr: "wakad" },
        { itm_id: 'itm1005', itm_name: "Item5", dlvry_date: "2019-04-28", dlvry_status: "out for delivery", dlvry_addr: "wakad" },
        { itm_id: 'itm1008', itm_name: "Item8", dlvry_date: "2019-04-28", dlvry_status: "out for delivery", dlvry_addr: "wakad" }
    ]
};

module.exports = mock;
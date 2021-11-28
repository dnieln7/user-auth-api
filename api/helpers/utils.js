function applyHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
}

function loginResponse(token) {
    return {
        token: token
    }
}

function userResponse(successful, user) {
    return {
        successful: successful,
        user: user
    }
}

function errorResponse(message, description) {
    return {
        message: message,
        description: description
    }
}

function deleteResponse(successful, message, id) {
    return {
        successful: successful,
        message: message,
        id: id
    }
}

module.exports = {
    loginResponse,
    userResponse,
    errorResponse,
    deleteResponse,
    applyHeaders
}

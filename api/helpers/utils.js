function applyHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
}

function getLoginResponse(token) {
    return {
        token: token
    }
}

function getUserResponse(successful, user) {
    return {
        successful: successful,
        user: user
    }
}

function getErrorResponse(message, description) {
    return {
        message: message,
        description: description
    }
}

module.exports = {
    getLoginResponse,
    getUserResponse,
    getErrorResponse,
    applyHeaders
}

const {tb_users} = require("../models");
const {errorResponse, userResponse, deleteResponse} = require("../helpers/utils");
const {applyHeaders} = require("../helpers/utils");

function updateUser(req, res) {
    applyHeaders(res);

    const id = req.swagger.params.id.value;
    const user = req.body;

    tb_users.findByPk(id).then(result => {
        if (!result) {
            return res.status(404).send(errorResponse("Not found", "ID " + id + " does not exists"));
        }

        return result.update(user)
            .then(updated => res.status(200).send(userResponse(true, updated)))
            .catch(reason => res.status(500).send(errorResponse("There was an error", reason.toString())));
    }).catch(reason => res.status(500).send(errorResponse("There was an error", reason.toString())));
}

function deleteUser(req, res) {
    applyHeaders(res);

    const id = req.swagger.params.id.value;

    tb_users.findByPk(id).then(result => {
        if (!result) {
            return res.status(404).send(deleteResponse(true, "Not found", id));
        }

        return result.destroy()
            .then(_ => res.status(200).send(deleteResponse(true, "Deleted", id)))
            .catch(reason => res.status(500).send(errorResponse("There was an error", reason.toString())));
    }).catch(reason => res.status(500).send(errorResponse("There was an error", reason.toString())));
}

module.exports = {
    updateUser,
    deleteUser
}
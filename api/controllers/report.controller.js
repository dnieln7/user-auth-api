const {tb_reports} = require("../models");
const {errorResponse, reportResponse, deleteResponse} = require("../helpers/utils");
const {applyHeaders} = require("../helpers/utils");

function getReports(req, res) {
    applyHeaders(res);

    const creatorId = req.swagger.params.id.value;

    tb_reports.findAll({where: {creator_id: creatorId}})
        .then(result => res.status(200).send(result))
        .catch(reason => res.status(500).send(errorResponse("There was an error", reason.toString())));
}

function postReport(req, res) {
    applyHeaders(res);

    const report = req.body;

    tb_reports.create(report)
        .then(result => res.status(201).send(reportResponse(true, result)))
        .catch(reason => res.status(500).send(errorResponse("There was an error", reason.toString())));
}

function getReportById(req, res) {
    applyHeaders(res);

    const id = req.swagger.params.id.value;

    tb_reports.findByPk(id).then(result => {
        if (!result) {
            return res.status(404).send(errorResponse("Not found", "ID " + id + " does not exists"));
        }

        return res.status(200).send(reportResponse(true, result));
    }).catch(reason => res.status(500).send(errorResponse("There was an error", reason.toString())));
}

function updateReport(req, res) {
    applyHeaders(res);

    const id = req.swagger.params.id.value;
    const report = req.body;

    tb_reports.findByPk(id).then(result => {
        if (!result) {
            return res.status(404).send(errorResponse("Not found", "ID " + id + " does not exists"));
        }

        return result.update(report)
            .then(updated => res.status(200).send(reportResponse(true, updated)))
            .catch(reason => res.status(500).send(errorResponse("There was an error", reason.toString())));
    }).catch(reason => res.status(500).send(errorResponse("There was an error", reason.toString())));
}

function deleteReport(req, res) {
    applyHeaders(res);

    const id = req.swagger.params.id.value;

    tb_reports.findByPk(id).then(result => {
        if (!result) {
            return res.status(404).send(deleteResponse(true, "Not found", id));
        }

        return result.destroy()
            .then(_ => res.status(200).send(deleteResponse(true, "Deleted", id)))
            .catch(reason => res.status(500).send(errorResponse("There was an error", reason.toString())));
    }).catch(reason => res.status(500).send(errorResponse("There was an error", reason.toString())));
}

module.exports = {
    getReports,
    postReport,
    getReportById,
    updateReport,
    deleteReport
}
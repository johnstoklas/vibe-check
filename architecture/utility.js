const express = require('express');

/* Alerts the client with a status code and message usually when an error condition is met, logs that message, and redirects the user to a different part of the website. */
async function alertRedirect(req, res, message, redirectPath) {
    console.log(message);
    req.session.showAlert = true;
    req.session.alertMessage = message;
    res.redirect(redirectPath);
};

/* Indicates that no alert is required and logs a success message. */
async function noAlert(req, res, message) {
    console.log(message);
    req.session.showAlert = false;
    req.session.alertMessage = "No alert required!";
};

module.exports = {alertRedirect, noAlert}
const express = require('express');

/* Alerts the client with a message usually when an error condition is met with a fetch and then logs the message. */
async function fetchAlert(req, res, message) {
    console.log(message);
    res.json({alert: true, message});
};

/* Logs a message (usually a successful one) and then redirects the user to a different part of the website afterwards with a fetch. */
async function fetchRedirect(req, res, message, redirectPath = '/') {
    console.log(message);
    res.json({redirect: true, redirectPath});
};

/* Combines the two prior functions and allows both an alert to be called and a redirect to occur afterwards. */
async function fetchAlertRedirect(req, res, message, redirectPath = '/') {
    console.log(message);
    res.json({alert: true, redirect: true, message, redirectPath});
};

/* Logs a message and then reloads the current page. */
async function fetchReload(req, res, message) {
    console.log(message);
    res.json({reload: true});
};

module.exports = {fetchAlert, fetchRedirect, fetchAlertRedirect, fetchReload};
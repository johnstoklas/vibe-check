/**
 * @module utility/fetchHelpers
 * @description Utility functions for client-side alerts, redirects, and reloads via fetch responses
 */

const express = require('express');

/**
 * Sends an alert message back to the client and logs the message
 * @async
 * @function fetchAlert
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {string} message - The message to display in the alert.
 * @returns {Promise<void>}
 */
async function fetchAlert(req, res, message) {
    console.log(message);
    res.json({alert: true, message});
}

/**
 * Sends a redirect instruction back to the client and logs the message
 * @async
 * @function fetchRedirect
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {string} message - The message to log.
 * @param {string} [redirectPath='/'] - The path to redirect the client to.
 * @returns {Promise<void>}
 */
async function fetchRedirect(req, res, message, redirectPath = '/') {
    console.log(message);
    res.json({redirect: true, redirectPath});
}

/**
 * Sends both an alert and a redirect instruction back to the client and logs the message
 * @async
 * @function fetchAlertRedirect
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {string} message - The message to display in the alert.
 * @param {string} [redirectPath='/'] - The path to redirect the client to.
 * @returns {Promise<void>}
 */
async function fetchAlertRedirect(req, res, message, redirectPath = '/') {
    console.log(message);
    res.json({alert: true, redirect: true, message, redirectPath});
}

/**
 * Sends a reload instruction back to the client and logs the message
 * @async
 * @function fetchReload
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {string} message - The message to log.
 * @returns {Promise<void>}
 */
async function fetchReload(req, res, message) {
    console.log(message);
    res.json({reload: true});
}

module.exports = {fetchAlert, fetchRedirect, fetchAlertRedirect, fetchReload};

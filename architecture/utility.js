const express = require('express');

/* Alerts the client with a status code and message usually when an error condition is met, logs that message, and redirects the user to a different part of the website. TODO: has not been coordinated with the client yet. */
async function alertRedirect(req, res, message, redirectPath = '/') {
    console.log(message);
    req.session.showAlert = true;
    req.session.alertMessage = message;
    res.redirect(redirectPath);
};

/* Indicates that no alert is required and logs a success message, redirecting the user to a different part of the website afterwards. TODO: has not been coordinated with the client yet. */
async function noAlertRedirect(req, res, message, redirectPath = '/') {
    console.log(message);
    req.session.showAlert = false;
    req.session.alertMessage = "No alert required!";
    res.redirect(redirectPath);
};

/* Waits for a specific value to be reached. */
async function waitForValue(variableGetter, targetValue, timeout = 10000, interval = 100) {

    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if(variableGetter() === targetValue)
        return;
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  
    throw new Error(`Timeout waiting for value to become ${targetValue}`);
};

async function waitForDifference(variableGetter, originalValue, timeout = 10000, interval = 100) {
   
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if(variableGetter() !== originalValue)
        return;
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  
    throw new Error(`Timeout waiting for value to differ from ${originalValue}`);
};

module.exports = {alertRedirect, noAlertRedirect, waitForValue, waitForDifference}
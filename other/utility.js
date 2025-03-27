const express = require('express');

/* Returns early when an error condition is met, logging a message and redirecting the user to a different part of the website. */
async function logReturnEarly(message, redirectPath, res) {
    console.log(message);
    res.redirect(redirectPath);
};

module.exports = {logReturnEarly}
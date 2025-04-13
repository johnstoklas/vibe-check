const express = require('express');

// models
const charactersModel = require('../models/Characters').Characters;
const unlockedCharactersModel = require('../models/UnlockedCharacters').UnlockedCharacters;
const traitsModel = require('../models/Traits').Traits;

// Gets all characters
async function getAllCharacters(req, res) {
    try {
        const characters = await charactersModel.selectAllWithTraits();
        res.json({
            data: characters.map(char => ({
                ...char,
                traits: char.traits ? char.traits.split(',') : []
            }))
        });
    } catch (error) {
        throw new Error('Failed to fetch characters');
    }
};

// Gets all traits
async function getAllTraits(req, res) {
    try {
        const traits = await traitsModel.selectAllOrdered();
        res.json({ data: traits });
    } catch (error) {
        throw new Error('Failed to fetch traits');
    }
};

// Gets characters by trait
async function getCharactersByTrait(req, res) {
    try {
        const { traitID } = req.params;
        const characters = await charactersModel.selectByTrait(traitID);

        res.json({
            data: characters.map(char => ({
                ...char,
                traits: char.traits ? char.traits.split(',') : []
            }))
        });
    } catch (error) {
        throw new Error('Failed to fetch characters by trait');
    }
};

// Gets unlocked characters for current user
async function getUnlockedCharacters(req, res) {
    try {
        if (!req.session.accountID)
            throw new Error('User not authenticated');
        const characters = await unlockedCharactersModel.selectAllWithTraits(req.session.accountID);

        res.json({
            data: characters.map(char => ({
                ...char,
                traits: char.traits ? char.traits.split(',') : []
            }))
        });
    } catch (error) {
        throw new Error('Failed to fetch unlocked characters');
    }
};

module.exports = {
    getAllCharacters,
    getAllTraits,
    getCharactersByTrait,
    getUnlockedCharacters, 
};


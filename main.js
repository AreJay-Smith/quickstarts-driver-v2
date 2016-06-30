var Driver = require('./quickstarts-driver');
var json2csv = require('json2csv');
var fs = require('fs');
var Utils = require('utils');
var sleep = require('sleep');

var quickstartsIds = [1270294377]

var fields = ['connector', 'collection', 'collection_description', 'card', 'card_description', 'card_id', 'data_name', 'dataset_id' ];
var row = {};
var beginLoop = false;
var collectionsLoop = false;
var cardLoop = false;
var params = {};
var totalCollections;
var totalcards;
var collectionLookup = {};
var descriptionLookup = {};

var print = function(cardsCSV, fileName) {

    json2csv({ data: cardsCSV, fields: fields}, function(err, csv) {
            if (err) console.log(err);
            fs.writeFile(fileName, csv, function(err) {
                if (err) throw err;
                console.log('file ' + fileName + ' saved');
            });
        });;
}

var haveCollections = function(collectionObject) {
console.log("4. I Have Collections");
totalCollections = 0;
totalcards = 0;
    //reset row
    var connector = collectionObject.title
    var cardIds = collectionObject.cards;

    //add the connector
    params["connector"] = connector;

    //get number of total of everything
    for (var i = 0; i < collectionObject.collections.length ; i++) {

        totalCollections += 1;
        var cardIndices = collectionObject.collections[i].cardIndices

        collectionLookup[i] = collectionObject.collections[i].title;
        descriptionLookup[i] = collectionObject.collections[i].description;

        for ( var x = 0; x < cardIndices.length ; x++) {

            totalcards += 1;
        }

    }




    //collectionObject.collections.length
    for (var i = 0; i < collectionObject.collections.length ; i++) {
console.log("5. let's go through the collections");

        params["collections"] = collectionObject.collections[i].title;
        params["collection_description"] = collectionObject.collections[i].description;

        cardIndices = collectionObject.collections[i].cardIndices

        if (i == collectionObject.collections.length - 1) {
            collectionsLoop = true;
        }

        //cardIndices.length
        for ( var x = 0; x < cardIndices.length ; x++) {
console.log("6. Let's go through the cards");
                cardLoop = false;
                var cardIndex = cardIndices[x];

                var cardId = cardIds[cardIndex].id;

                if (x == cardIndices.length - 1) {
                    cardLoop = true;
                }

                Driver.fetchCardData(cardId, params, collectionsLoop, cardLoop, print, i, x, totalcards, collectionLookup, descriptionLookup);
        }
    }
}

var begin = function(){
    for (var i = 0; i < 2; i++) {

        //last Id?
        console.log("1. Begin the first loop");
        Driver.fetchCollection(quickstartsIds[i], haveCollections);
    }
}

begin();

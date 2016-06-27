'use strict';

var request = require('request');
var fs = require('fs');
var sleep = require('sleep');
// var utils = require('./utils.js');

var QuickstartsDriver = (function() {

    var publicInterface = {};
    var row = {};
    var wait = false;
    var totalrows = 0;
    var table = {};
    var cardsCSV = [];

    // MARK: Constants
    var SID = 'eyJjdXN0b21lcklkIjoiZG9tbyIsImV4cGlyYXRpb24iOjE0NjY3Mjc1NDc0OTMsImhtYWNTaWduYXR1cmUiOiI1Mzc2YjhjMWUwMTNlOGQxMjY5ZjM4NjdjOTdhYjNlMzM5MzQ5YmI1MDlhOGUxYmIyZWZjZDc5NjI1NDJmYTZiIiwicm9sZSI6IlByaXZpbGVnZWQiLCJ0aW1lc3RhbXAiOjE0NjY2OTg3NDc0OTMsInVzZXJJZCI6IjU5MzE1OTE2NyJ9';
    var headers = {
    'Content-Type': 'application/json',
    'x-domo-authentication': SID
    }

publicInterface.fetchCollection = function(id, callback) {
console.log("2. I'm getting the collection");
        var url = 'https://domo.domo.com/api/content/v1/stacks/' + id;
        var options = {
            url: url,
            method: 'GET',
            json: true,
            headers: headers
        }

        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {

                var collections = body
console.log("3. Got it");
                callback(body);

            }else{
                console.log(error);
            }
        })
}

publicInterface.fetchCardData = function(id, params, collectionsLoop, cardLoop, print, i, x, totalcards, collectionLookup, descriptionLookup) {
console.log("7. I'm getting the card");
    wait = true
    var payload = 'kpiIdList%5B%5D=' + id + '&includeData=true';
    console.log(payload);

    var kpiHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-domo-authentication': SID
    }

    var url = 'https://domo.domo.com/kpis/getkpis';
    var options = {
        url: url,
        body: payload,
        method: 'POST',
        json: true,
        headers: kpiHeaders
    }


    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            var card = body
            row = {}
            var open = card[id];

            var cardTitle = open.kpiTitle;
            var cardDesc = open.description;
            var appId = id;
            var dataName = open.kpiDataSubscriptionList[0].dataSourceName;
            var dataId = open.kpiDataSubscriptionList[0].dataSourceId;

            row["connector"] = params.connector;
            row["collection"] = collectionLookup[i];
            row["collection_description"] = descriptionLookup[i];
            row["card"] = cardTitle;
            row["card_description"] = cardDesc;
            row["card_id"] = appId;
            row["data_name"] = dataName;
            row["dataset_id"] = dataId;
            cardsCSV.push(row);

console.log("8. Add to the stack");
            totalrows += 1;
console.log(collectionsLoop + " " + i + " " + cardLoop + " " + x);
            if (totalrows == totalcards) {
                print(cardsCSV);
            }





            //callback(cardObject, row, id);

        }else{

            console.log(response);

        }
    })
    // while(wait == true) {
    //     console.log("In the loop");
    // }
}

    return publicInterface;

})();

module.exports = QuickstartsDriver;

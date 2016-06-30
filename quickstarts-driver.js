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
    var SID = 'eyJjdXN0b21lcklkIjoiZG9tby1xdWlja3N0YXJ0czEiLCJleHBpcmF0aW9uIjoxNDY3MjYxOTYwNDgyLCJobWFjU2lnbmF0dXJlIjoiNWRiZjhlY2ZlNDJkYTk3ZTU3ZDgzMDJmNGVhZTE3MzRmODE4MTdjY2VjMTdkMDdmZTE4ZjYzMjY3Yjg0MWQ1ZSIsInJvbGUiOiJBZG1pbiIsInRpbWVzdGFtcCI6MTQ2NzIzMzE2MDQ4MiwidXNlcklkIjoiMTg4ODc4NjkzNSJ9';
    var headers = {
    'Content-Type': 'application/json',
    'x-domo-authentication': SID
    }

publicInterface.fetchCollection = function(id, callback) {
console.log("2. I'm getting the collection");
        var url = 'https://domo-quickstarts1.beta.domo.com/api/content/v1/stacks/' + id;
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

    var url = 'https://domo-quickstarts1.beta.domo.com/kpis/getkpis';
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
            var fileName = "quickstarts/" + params.connector + ".csv";

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
                print(cardsCSV, fileName);
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

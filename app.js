/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var sleep = require('system-sleep');

// 6:51
// Setup Restify Server

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

//var connector = new builder.ConsoleConnector().listen();
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
//var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
//var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
//bot.set('storage', tableStorage);

bot.dialog('/', [
    function (session) {
        //var user_id = session.user.id
        session.send("Welcome to the online service of WellBeing HMO");
        builder.Prompts.choice(session, "What type of service are you looking for?", "See a doctor now|Schedule an appointment|Renew prescriptions", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.userData.serviceType = results.response.entity;
        builder.Prompts.choice(session, "What type of doctor do you like to see?", "General practitioner|Pediatrician|Psychiatrist|General nurse", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.userData.doctorType = results.response.entity;
        session.send("Ok. Searching available " + session.userData.doctorType + "...");
        sleep(5000);
        session.send("Doctor Smith is calling you. Please accept the call.\nThank you for using the online service!");
    }
]);

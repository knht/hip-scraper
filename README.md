# HIP Scraper

This is a simple scraper consisting of 2 separate services for getting notifications on Discord automatically from the "Hochschulinformationsportal" whenever a new grade is submitted.

## Configuration
To run the service yourself rename the `example.creds.js` file in `scraper/constants` to `creds.js` and the `example.config.js` file inside the `bot/constants` folder to `config.js` and fill in all fields.

You need to create a Discord Application, convert it to a Bot application and gather a OAuth2 Token with the Bot Scope to log into Discord.

Credentials for the scraper refer to the university account credentials from Reutlingen University.

## Running
Simply run both services with any process manager of your choice. The scraper scrapes HIP in an interval of 5 minutes.

## Maintenance Shutdown
The HIP portal is shut down between 11pm and 2am every day due to scheduled ongoing maintenance. Make sure to set up a Cron Job to shut down the services between 11pm - 2am.

## Disclaimer
This little project was made in the span of a couple of hours without any scalability or robustness in mind. Its sole purpose is to provide a quick and dirty way of having information from HIP piped to Discord in a user friendly fashion. 

## License
This repository is licensed under the MIT License and thus comes with all of its correlating traits.
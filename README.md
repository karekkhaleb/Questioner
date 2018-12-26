# Questioner

![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)
[![Build Status](https://travis-ci.org/karekkhaleb/Questioner.svg?branch=Develop)](https://travis-ci.org/karekkhaleb/Questioner)
[![Coverage Status](https://coveralls.io/repos/github/karekkhaleb/Questioner/badge.svg?branch=Develop)](https://coveralls.io/github/karekkhaleb/Questioner?branch=Develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/5fbdaed021a61dc69a8f/maintainability)](https://codeclimate.com/github/karekkhaleb/Questioner/maintainability)


> This api is hosted at `https://caleb-questioner.herokuapp.com`

> UI templates are hosted at `https://karekkhaleb.github.io/Questioner/UI/`


# App Description
> This is an app for meetup organizers and meetup attenders

> The admin creates a meetup record

> Users can ask questions, upvote questions and respond Rsvps

## Running the api Locally

* clone the repo or download the zip
* Navigate to the folder where you downloaded or cloned the app
* Make sure you are on the Develop branch (Because the Develop branch has all the recent code)
* Run `npm install` from the terminal(make sure the port 9000 is free).
* Run `npm start` from the terminal to start the app.
* With the ideal tool preferably postman, send requests to the endpoints descriped bellow.

## Running the tests locally 
* clone the repo or downoald the zip file(extract the zip and navigate to the folder containing the app)
* Install dependecies with `npm install` (You can also use yarn) from the terminal
* Run tests with `npm test` (also yarn may work)


## Information on the API
 
> if you are running this app on from the hosted version, the following urls should preced this `https://caleb-questioner.herokuapp.com`

> if you are running this app from your local computer, the following urls should preced this `http://localhost:9000`


```json
{
  "get all meetups" : {
    "url" : "/api/v1/meetups",
    "method" : "GET"
  },
  "get single meetup" : {
    "url" : "/api/v1/meetups/<meetupId>",
    "method" : "GET"
  },
  "get all upcoming meetups" : {
    "url" : "/api/v1/meetups/upcoming",
    "method" : "GET"
  },
  "create new meetup record" : {
    "url" : "/api/v1/meetups",
    "method" : "POST",
    "objectFormat" : {
      "location" : "The location where the meetup will take place",
      "topic" : "The topic of the meetup",
      "happeningOn" : "The time that the meetup holds",
      "tags" : "optional tags for the meetup.",
    },
    "requirements" : [
      "tags should be an array of strings"
    ]
  },
  "respond Rsvps" : {
    "url" : "/api/v1/meetups/<meetupId>/rsvps",
    "method" : "POST",
    "objectFormat" : {
      "userId" : "The id of the user responding",
      "status" : "The response"
    },
    "requirements" : [
      "The meetup with the provided id should be available",
      "The user with the given id must be present",
      "The response should be yes, no or maybe"
    ]    
  },
  "creating the user" : {
    "url" : "api/v1/auth/signup",
    "method" : "POST",
    "objectFormat" : {
      "firstname" : "user's firstname",
      "lastname" : "user's last name",
      "email" : "user's email",
      "phoneNumber" : "user's phone number",
      "userName" : "user's username"
    },
  },
  "get all questions" : {
    "url" : "/api/v1/questions",
    "method" : "GET",
  },
  "create a new question" : {
    "url" : "/api/v1/questions",
    "method" : "POST",
    "objectFormat" : {
      "meetupId" : "the id of the meetup that correspons to this question",
      "createdBy" : "the id of the user creatin this question",
      "title" : "the title for this question",
      "body" : "the body for this question"
    },
    "requirements" : [
      "the meetup with this id should be present",
      "the user with this id should be present"
    ]
  },
  "upvote a  question": {
    "url" : "/api/v1/questions/<question-id>/upvote",
    "method" : "PATCH",
    "requirements" : [
      "the question with this id should be present"
    ]
  },
  "downvote a  question" : {
    "url" : "/api/v1/questions/<question-id>/downvote",
    "method" : "PATCH",
    "requirements" : [
      "the question with this id should be present"
    ]
  }
}

```

#! /usr/bin/env node

var child_process = require('child_process').exec;
var fs = require('fs');

var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');

var argv_offset = (process.argv[0] === 'git-status-monitor') ? 1 : 2;
var folder_to_watch;
var files_to_watch;
var notify_email_to;
var notify_email_from;
var project_name;
var git_status_process;
var git_status_text;
var changes_found = [];

// node app.js /Users/ungana/Documents/Rampart/Repos/RegattaCentral/Regattas-Cordova-2015 www/index.html,www/config.xml joshua@ramparthosting.com,joshua@ungana.com support@ramparthosting.com "RC Cordova 2015"

function checkFiles (data) {
  git_status_text = data;
  data.split('\n').forEach(function (line) {
    files_to_watch.forEach(function (file_to_watch) {
      var search_string = '\\s+' + file_to_watch + '$';
      if (line.trim().match(new RegExp(search_string, 'im'))) {
        changes_found.push(line.trim() + ' == ' + file_to_watch);
      }
    });
  });
  if (changes_found.length > 0) {
    sendAlert();
  }
}

function init () {
  if (!process.argv[argv_offset + 0]) {
    console.error('No folder to watch was provided.');
    return;
  }
  folder_to_watch = process.argv[argv_offset + 0];

  if (!process.argv[argv_offset + 1]) {
    console.error('No files to watch were provided.');
    return;
  }
  files_to_watch = process.argv[argv_offset + 1].split(',');

  if (!process.argv[argv_offset + 2]) {
    console.error('No email to send to was provided.');
    return;
  }
  notify_email_to = process.argv[argv_offset + 2].split(',');

  if (!process.argv[argv_offset + 3]) {
    console.error('No email to send from was provided.');
    return;
  }
  notify_email_from = process.argv[argv_offset + 3].split(',');

  if (!process.argv[argv_offset + 4]) {
    console.error('No project name was provided.');
    return;
  }
  project_name = process.argv[argv_offset + 4];

  git_status_process = child_process('git --git-dir=' + folder_to_watch + '/.git status', function (error, stdout, stderr) {
    if (stderr) {
      console.error(stderr);
    }
    else {
      checkFiles(stdout);
    }
  });
}

function sendAlert () {
  emailTemplates('templates', {
    helpers: require('./helpers/handlebars.helpers'),
    partials: require('./partials/handlebars.partials')
  }, function (error, template) {
    if (error) console.error(error);

    template('alert', {
      project_name: project_name,
      issue_found_array: '',
      git_status: git_status_text
    }, function (error, html, text) {
      if (error) console.error(error);

      notify_email_to.forEach(function (user) {
        var transporter = nodemailer.createTransport();
        transporter.sendMail({
          from: notify_email_from,
          to: user,
          subject: 'File Change Alert: ' + project_name,
          text: text
        });
      });
    });
  });
}

process.on('exit', function () {
  if (git_status_process) {
    git_status_process.kill();
  }
});

init();

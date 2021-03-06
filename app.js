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

function checkFiles (data) {
  if ((data.indexOf('nothing to commit, working directory clean') === -1) && (data.indexOf('Initial commit') === -1)) {
    if (files_to_watch.indexOf('$') > -1) {
      sendAlert(false);
    }
    else {
      data.split('\n').forEach(function (line) {
        files_to_watch.forEach(function (file_to_watch) {
          file_to_watch = file_to_watch.replace(/^\/|\/$/g, '');
          var search_string = (file_to_watch.indexOf('*') > -1) ? '\\s' + file_to_watch.replace(/\*/g, '') + '.*' : '\\s+' + file_to_watch + '$';
          if (line.trim().match(new RegExp(search_string, 'im'))) {
            changes_found.push(line.trim());
          }
        });
      });
      if (changes_found.length > 0) {
        sendAlert(true);
      }
    }
  }
}

function init () {
  if (!process.argv[argv_offset]) {
    console.error('No folder to watch was provided.');
    return;
  }
  folder_to_watch = process.argv[argv_offset];

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

  git_status_process = child_process('git --git-dir=' + folder_to_watch + '/.git --work-tree=' + folder_to_watch + ' status', function (error, stdout, stderr) {
    if (stderr) {
      console.error(stderr);
      sendError(stderr);
    }
    else {
      git_status_text = stdout;
      checkFiles(stdout);
    }
  });
}

function sendAlert (show_flagged) {
  emailTemplates(__dirname + '/templates', {
    helpers: require('./helpers/handlebars.helpers'),
    partials: require('./partials/handlebars.partials')
  }, function (error, template) {
    if (error) console.error(error);

    template('alert', {
      project_name: project_name,
      changes_found: changes_found,
      git_status: git_status_text,
      show_flagged: show_flagged
    }, function (error, html, text) {
      if (error) console.error(error);

      notify_email_to.forEach(function (user) {
        var transporter = nodemailer.createTransport();
        transporter.sendMail({
          from: notify_email_from,
          to: user,
          subject: 'File Change Alert: ' + project_name,
          text: text,
          headers: {
            "x-priority": "1",
            "x-msmail-priority": "High",
            importance: "high"
          }
        });
      });
    });
  });
}

function sendError (script_error) {
  emailTemplates(__dirname + '/templates', {
    helpers: require('./helpers/handlebars.helpers'),
    partials: require('./partials/handlebars.partials')
  }, function (error, template) {
    if (error) console.error(error);

    template('error', {
      project_name: project_name,
      error: script_error
    }, function (error, html, text) {
      if (error) console.error(error);

      notify_email_to.forEach(function (user) {
        var transporter = nodemailer.createTransport();
        transporter.sendMail({
          from: notify_email_from,
          to: user,
          subject: 'File Change Alert: ' + project_name,
          text: text,
          headers: {
            "x-priority": "1",
            "x-msmail-priority": "High",
            importance: "high"
          }
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

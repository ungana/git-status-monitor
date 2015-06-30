# Git Status Monitor

Monitors a git repo for changes via git status & notifies you when changes show up via email. Useful for monitoring files for unexpected changes in production.

**NOTE**: This application should be called from a scheduling application such as cron. By itself it will only run once.

## Installation

```bash
npm install -g git-status-monitor
```

## Usage

```bash
git-status-monitor $folder_to_watch $files_to_watch $notify_email_to $notify_email_from $project_name
```

 * **folder_to_watch**: The directory the git repo you wish to monitor is in.
 * **files_to_watch**: A comma-delimited list of files you wish to be alerted to that have changed. The files are relative to the project root. To watch the entire repo, set this to **$**. To watch entire subdirectories, use the folder name with an asterisk (Example: www/*).
 * **notify_email_to**: A comma-delimited list of email addresses that are to receive the alert that the file has changed.
 * **notify_email_from**: The email address the alert should come from.
 * **project_name**: The name of the project. This is used in the alert message.

### Example Usage (Basic)

```bash
git-status-monitor /var/www/wp_site .htaccess,wp-config.php dev@example.org,sys@example.org alerts@example.org "My WP Site"
```

### Example Usage (Entire Repo)

```bash
git-status-monitor /var/www/wp_site $ dev@example.org,sys@example.org alerts@example.org "My WP Site"
```

### Example Usage (One File & Sub Directory)

```bash
git-status-monitor /var/www/wp_site .htaccess,wp-content/* dev@example.org,sys@example.org alerts@example.org "My WP Site"
```

## Change Log

> ## [0.2.1] - 2015-06-30
> ### Added
> - Change Log
> 
> ## [0.2.0] - 2015-06-30
> ### Added
> - Now has the ability to watch the entire repo.
> - Now has the ability to watch sub directories.
> - Now notifies you if the repo is missing or deleted.
> 
> ### Fixed
> - The "git status" command needed an update to be correct.
> - Fixed an issue where the email sent did not include the files that triggered the alert at the top.
> - Now checks to see if nothing has changed.
> 
> ## [0.2.0] - 2015-06-29
> ### Added
> - Initial Project Upload

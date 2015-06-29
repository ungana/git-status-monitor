# Git Status Monitor

Monitors a git repo for changes via git status & notifies you when changes show up via email. Useful for monitoring files for unexpected changes in production.

## Usage

```bash
git-status-monitor $folder_to_watch $files_to_watch $notify_email_to $notify_email_from $project_name
```

 * **folder_to_watch**: The directory the git repo you wish to monitor is in.
 * **files_to_watch**: A comma-delimited list of files you wish to be alerted that have changed. The files are relative to the project root.
 * **notify_email_to**: A comma-delimited list of email addresses that are to recived the alert that the file has changed.
 * **notify_email_from**: The email address the alert should come from.
 * **project_name**: The name of the project. This is used in the alert message.

### Example Usage

```bash
git-status-monitor /var/www/wp_site .htaccess,wp-config.php dev@example.org,sys@example.org alerts@example.org "My WP Site"
```

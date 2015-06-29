# Git Status Monitor

Monitors a git repo for changes via git status & notifies you when changes show up via email. Useful for monitoring files for unexpected changes in production.

## Usage

```javascript
git-status-monitor $Project_Directory $Files_To_Watch $Send_Alert_To $Send_Alert_From $Project_Title
```

### Example

```javascript
git-status-monitor /var/www/wp_site .htaccess,wp-config.php dev@example.org,sys@example.org alerts@example.org "My WP Site"
```

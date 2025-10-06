# Resolving Merge Conflicts for the Drink Cabinet Project

GitHub reports merge conflicts when the target branch (usually `main`) has
changed in the same files and sections that your pull request touches. In this
case the conflict message lists `README.md`, `app.js`, `index.html`,
`server.js`, and `styles.css`. That means the current `main` branch has edits in
those files that overlap with the versions in your feature branch.

To resolve the situation you need to sync your branch with the latest `main`
changes and reconcile any overlapping edits locally before pushing an updated
commit.

## Quick resolution steps

1. **Fetch the latest `main`:**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Return to your feature branch and merge `main`:**
   ```bash
   git checkout work
   git merge main
   ```
   Git will stop at each conflicted file and mark the conflicting sections with
   `<<<<<<<`, `=======`, and `>>>>>>>` markers.
3. **Open the listed files** (`README.md`, `app.js`, `index.html`, `server.js`,
   `styles.css`) and decide how to keep both sets of desired changes. Remove the
   conflict markers once you have the correct combined content.
4. **Mark the files as resolved and commit:**
   ```bash
   git add README.md app.js index.html server.js styles.css
   git commit
   ```
5. **Push the updated branch:**
   ```bash
   git push origin work
   ```
   Your pull request should now show as mergeable on GitHub.

If you prefer rebasing, you can rebase your branch onto `main` (`git rebase
main`) instead of merging. The important part is resolving the conflicts locally
and pushing the updated result so GitHub sees a conflict-free branch.


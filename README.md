# d-blog

## Hosted comments

Comments use CommentBox.io and are stored by the service, not in browser `localStorage`.
Visitors can post anonymously when anonymous posting is enabled in the CommentBox project.

1. Create a project at [CommentBox Dashboard](https://dashboard.commentbox.io/).
2. Add `ducinsights.io.vn` as the website domain and enable anonymous posting.
3. Copy the project ID into `commentBoxProjectId` in `assets/js/site-config.js`.
4. Deploy the site. The homepage and every file in `posts/` already include the widget.

The free plan currently includes 100 comments per month and basic moderation.
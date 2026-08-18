output "site_bucket_name" {
  description = "Name of the S3 bucket that stores the built Angular app."
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "Used by CI to invalidate the cache after each deploy."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront's default domain."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "site_url" {
  description = "Public URL of the deployed app (CloudFront's default *.cloudfront.net domain)."
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "github_deploy_role_arn" {
  description = "Role ARN to reference as AWS_DEPLOY_ROLE_ARN in the GitHub Actions workflow."
  value       = aws_iam_role.deploy.arn
}

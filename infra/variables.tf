variable "aws_region" {
  description = "Region for the S3 bucket."
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Short project name used for tagging and resource naming."
  type        = string
  default     = "cloud-taller"
}

variable "cloudfront_price_class" {
  description = "Reduced price class keeps CloudFront edge locations limited to lower-cost regions (cost optimization pillar)."
  type        = string
  default     = "PriceClass_100"
}

variable "github_org" {
  description = "GitHub org/user that owns the repo allowed to assume the deploy role via OIDC."
  type        = string
}

variable "github_repo" {
  description = "GitHub repo (name only, no org) allowed to assume the deploy role via OIDC."
  type        = string
}

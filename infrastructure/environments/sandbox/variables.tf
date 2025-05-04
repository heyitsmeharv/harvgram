variable "role_arn" {
  type        = string
  description = "arn of the role that will terraform into aws account"
}

variable "bucket_name" {
  description = "Name of the existing S3 bucket"
  type        = string
}

variable "lambda_runtime" {
  description = "Runtime for lambda functions"
  type        = string
}

variable "ses_from_email_address" {
  description = "email address to send emails from"
  type        = string
}

variable "ses_to_email_address" {
  description = "email address to send emails to"
  type        = string
}

variable "frontend_url" {
  description = "url for frontend application"
  type        = string
}

variable "root_domain" {
  description = "domain for the application"
  type        = string
}
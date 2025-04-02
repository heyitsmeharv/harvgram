variable "lambda_runtime" {
  description = "Lambda runtime version"
  type        = string
}

variable "s3_picture_bucket" {
  description = "Name of the S3 bucket that stores images"
  type        = string
}

variable "dynamodb_picture_table" {
  description = "Name of the dynamodb picture table"
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

variable "cognito_user_pool_id" {
  description = "id of user pool"
  type        = string
}

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

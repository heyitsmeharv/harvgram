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

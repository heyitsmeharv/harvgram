variable "lambda_arns" {
  description = "List of lambda arns"
}

variable "cognito_user_pool_arn" {
  description = "Cognito user pool id"
  type        = string
}

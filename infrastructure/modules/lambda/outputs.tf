output "lambda_arns" {
  value = {
    read   = aws_lambda_function.get_picture_lambda.arn
    create = aws_lambda_function.upload_picture_lambda.arn
  }
}

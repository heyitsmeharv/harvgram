output "lambda_arns" {
  value = {
    get_picture          = aws_lambda_function.get_picture_lambda.arn
    upload_picture       = aws_lambda_function.upload_picture_lambda.arn
    create_picture_entry = aws_lambda_function.create_picture_entry_lambda.arn
  }
}

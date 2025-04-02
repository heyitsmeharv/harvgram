output "lambda_arns" {
value = {
    sign_up              = "arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/${aws_lambda_function.sign_up_lambda.arn}/invocations"
    get_picture          = "arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/${aws_lambda_function.get_picture_lambda.arn}/invocations"
    upload_picture       = "arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/${aws_lambda_function.upload_picture_lambda.arn}/invocations"
    create_picture_entry = "arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/${aws_lambda_function.create_picture_entry_lambda.arn}/invocations"
  }
}

resource "aws_iam_role" "lambda_role" {
  name               = "${locals.name}_lambda_role"
  assume_role_policy = data.template_file.assume_role_policy_lambda
}

resource "aws_iam_role_policy" "lambda_role_policy" {
  role   = aws_iam_role.lambda_role.name
  policy = data.template_file.role_policy_lambda.rendered
}

resource "aws_lambda_function" "get_picture_lambda" {
  function_name    = "${locals.name}_get_picture"
  description      = "Lambda to get picture"
  filename         = data.archive_file.get_picture_lambda.output_path
  source_code_hash = data.archive_file.get_picture_lambda.output_base64sha512
  role             = aws_iam_role.lambda_role.arn
  handler          = "get_picture.handler"
  runtime          = var.lambda_runtime
  timeout          = 30

  environment {
    variables = {
      TABLE_NAME = locals.name
    }
  }

  tracing_config {
    mode = "Active"
  }
}

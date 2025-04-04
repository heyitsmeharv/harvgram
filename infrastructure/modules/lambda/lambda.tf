resource "aws_iam_role" "lambda_role" {
  name               = "${local.name}_lambda_role"
  assume_role_policy = data.template_file.assume_role_policy_lambda.rendered
}

resource "aws_iam_role_policy" "lambda_role_policy" {
  role   = aws_iam_role.lambda_role.name
  policy = data.template_file.role_policy_lambda.rendered
}

resource "aws_lambda_function" "sign_up_lambda" {
  function_name    = "${local.name}_sign_up"
  description      = "Lambda to sign up to the application"
  filename         = data.archive_file.sign_up_lambda.output_path
  source_code_hash = data.archive_file.sign_up_lambda.output_base64sha512
  role             = aws_iam_role.lambda_role.arn
  handler          = "sign_up.handler"
  runtime          = var.lambda_runtime
  timeout          = 30

  environment {
    variables = {
      TO_EMAIL_ADDRESS   = var.ses_to_email_address
      FROM_EMAIL_ADDRESS = var.ses_from_email_address
      FRONTEND_URL       = var.frontend_url
    }
  }

  tracing_config {
    mode = "Active"
  }
}

resource "aws_lambda_function" "approve_user_lambda" {
  function_name    = "${local.name}_approve_user"
  description      = "Lambda to create user in cognito"
  filename         = data.archive_file.approve_user_lambda.output_path
  source_code_hash = data.archive_file.approve_user_lambda.output_base64sha512
  role             = aws_iam_role.lambda_role.arn
  handler          = "approve_user.handler"
  runtime          = var.lambda_runtime
  timeout          = 30

  environment {
    variables = {
      FROM_EMAIL_ADDRESS   = var.ses_from_email_address,
      COGNITO_USER_POOL_ID = var.cognito_user_pool_id
      FRONTEND_URL         = var.frontend_url
    }
  }

  tracing_config {
    mode = "Active"
  }
}

resource "aws_lambda_function" "create_picture_entry_lambda" {
  function_name    = "${local.name}_create_picture_entry"
  description      = "Lambda to create picture entry"
  filename         = data.archive_file.create_picture_entry_lambda.output_path
  source_code_hash = data.archive_file.create_picture_entry_lambda.output_base64sha512
  role             = aws_iam_role.lambda_role.arn
  handler          = "create_picture_entry.handler"
  runtime          = var.lambda_runtime
  timeout          = 30

  environment {
    variables = {
      PICTURE_TABLE_NAME = var.dynamodb_picture_table
    }
  }

  tracing_config {
    mode = "Active"
  }
}

resource "aws_lambda_function" "get_picture_lambda" {
  function_name    = "${local.name}_get_picture"
  description      = "Lambda to get picture"
  filename         = data.archive_file.get_picture_lambda.output_path
  source_code_hash = data.archive_file.get_picture_lambda.output_base64sha512
  role             = aws_iam_role.lambda_role.arn
  handler          = "get_picture.handler"
  runtime          = var.lambda_runtime
  timeout          = 30

  environment {
    variables = {
      TABLE_NAME = local.name
    }
  }

  tracing_config {
    mode = "Active"
  }
}

resource "aws_lambda_function" "upload_picture_lambda" {
  function_name    = "${local.name}_upload_picture"
  description      = "Lambda to upload pictures"
  filename         = data.archive_file.upload_picture_lambda.output_path
  source_code_hash = data.archive_file.upload_picture_lambda.output_base64sha512
  role             = aws_iam_role.lambda_role.arn
  handler          = "upload_picture.handler"
  runtime          = var.lambda_runtime
  timeout          = 30

  environment {
    variables = {
      PICTURES_BUCKET_NAME = var.s3_picture_bucket
    }
  }

  tracing_config {
    mode = "Active"
  }
}

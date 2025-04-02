resource "aws_api_gateway_rest_api" "harvgram_api" {
  name        = "${local.name}_api_gateway"
  description = "API Gateway for Lambda"
}

resource "aws_api_gateway_resource" "sign_up_email" {
  rest_api_id = aws_api_gateway_rest_api.harvgram_api.id
  parent_id   = aws_api_gateway_rest_api.harvgram_api.root_resource_id
  path_part   = "sendEmail"
}

resource "aws_api_gateway_resource" "create_picture_entry" {
  rest_api_id = aws_api_gateway_rest_api.harvgram_api.id
  parent_id   = aws_api_gateway_rest_api.harvgram_api.root_resource_id
  path_part   = "createPictureEntry"
}
resource "aws_api_gateway_resource" "upload_picture" {
  rest_api_id = aws_api_gateway_rest_api.harvgram_api.id
  parent_id   = aws_api_gateway_rest_api.harvgram_api.root_resource_id
  path_part   = "upload"
}

resource "aws_api_gateway_resource" "get_picture" {
  rest_api_id = aws_api_gateway_rest_api.harvgram_api.id
  parent_id   = aws_api_gateway_rest_api.harvgram_api.root_resource_id
  path_part   = "get"
}

resource "aws_api_gateway_method" "sign_up_email" {
  rest_api_id   = aws_api_gateway_rest_api.harvgram_api.id
  resource_id   = aws_api_gateway_resource.sign_up_email.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "create_picture_entry" {
  rest_api_id   = aws_api_gateway_rest_api.harvgram_api.id
  resource_id   = aws_api_gateway_resource.create_picture_entry.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_method" "upload_picture" {
  rest_api_id   = aws_api_gateway_rest_api.harvgram_api.id
  resource_id   = aws_api_gateway_resource.upload_picture.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_method" "get_picture" {
  rest_api_id   = aws_api_gateway_rest_api.harvgram_api.id
  resource_id   = aws_api_gateway_resource.get_picture.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name          = "CognitoAuthorizer"
  rest_api_id   = aws_api_gateway_rest_api.harvgram_api.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = [var.cognito_user_pool_arn]
}

resource "aws_api_gateway_integration" "sign_up_email_lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.harvgram_api.id
  resource_id             = aws_api_gateway_resource.sign_up_email.id
  http_method             = aws_api_gateway_method.sign_up_email.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns.sign_up
}

resource "aws_api_gateway_integration" "create_picture_entry_lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.harvgram_api.id
  resource_id             = aws_api_gateway_resource.create_picture_entry.id
  http_method             = aws_api_gateway_method.create_picture_entry.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns.create_picture_entry
}

resource "aws_api_gateway_integration" "upload_picture_lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.harvgram_api.id
  resource_id             = aws_api_gateway_resource.upload_picture.id
  http_method             = aws_api_gateway_method.upload_picture.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns.upload_picture
}

resource "aws_api_gateway_integration" "get_picture_lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.harvgram_api.id
  resource_id             = aws_api_gateway_resource.get_picture.id
  http_method             = aws_api_gateway_method.get_picture.http_method
  integration_http_method = "GET"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arns.get_picture
}

resource "aws_api_gateway_deployment" "ses_api_deployment" {
  depends_on  = [aws_api_gateway_integration.sign_up_email_lambda_integration]
  rest_api_id = aws_api_gateway_rest_api.harvgram_api.id
}

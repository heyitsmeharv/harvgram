resource "aws_secretsmanager_secret" "cognito_client_id" {
  name = "harvgram-cognito-client-id"
}

resource "aws_secretsmanager_secret_version" "cognito_client_id" {
  secret_id     = aws_secretsmanager_secret.cognito_client_id.id
  secret_string = jsonencode({ COGNITO_CLIENT_ID = var.cognito_client_id })
}

resource "aws_secretsmanager_secret" "cognito_user_pool_id" {
  name = "harvgram-user-pool-id"
}

resource "aws_secretsmanager_secret_version" "cognito_user_pool_id" {
  secret_id     = aws_secretsmanager_secret.cognito_user_pool_id.id
  secret_string = jsonencode({ COGNITO_USER_POOL_ID = var.cognito_user_pool_id })
}
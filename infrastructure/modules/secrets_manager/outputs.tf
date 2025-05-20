output "cognito_client_id_arn" {
  value = aws_secretsmanager_secret.cognito_client_id.arn
}

output "cognito_user_pool_id_arn" {
  value = aws_secretsmanager_secret.cognito_user_pool_id.arn
}

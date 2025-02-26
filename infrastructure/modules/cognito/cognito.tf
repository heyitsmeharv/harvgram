resource "aws_cognito_user_pool" "user_pool" {
  name = "harvgram-user-pool"

  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]

  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
  }

  mfa_configuration = "OFF"

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = false
  }
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name         = "harvgram-client"
  user_pool_id = aws_cognito_user_pool.user_pool.id

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  generate_secret                      = false
  prevent_user_existence_errors        = "ENABLED"
  callback_urls                        = ["http://localhost:3000"]
  logout_urls                          = ["http://localhost:3000/logout"]
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  allowed_oauth_flows_user_pool_client = true
  supported_identity_providers         = ["COGNITO"]
}

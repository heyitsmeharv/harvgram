output "ses_lambda_api_endpoint" {
  value = "${aws_api_gateway_deployment.ses_api_deployment.invoke_url}/send-email"
}
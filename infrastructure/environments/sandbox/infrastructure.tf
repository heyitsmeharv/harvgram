module "s3" {
  source = "../../modules/s3"

  bucket_name = var.bucket_name
}

module "dynamodb" {
  source = "../../modules/dynamodb"
}

module "lambda" {
  source = "../../modules/lambda"

  lambda_runtime = var.lambda_runtime
}

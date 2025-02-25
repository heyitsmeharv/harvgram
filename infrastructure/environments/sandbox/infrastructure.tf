module "s3" {
  source = "../../modules/s3"

  bucket_name = var.bucket_name
}

module "dynamodb" {
  source = "../../modules/dynamodb"
}

module "lambda" {
  source = "../../modules/lambda"

  lambda_runtime         = var.lambda_runtime
  s3_picture_bucket      = module.s3.s3_picture_bucket
  dynamodb_picture_table = module.dynamodb.dynamodb_picture_table
}

module "api_gateway" {
  source = "../../modules/api_gateway"

  lambda_arns = module.lambda.lambda_arns
}

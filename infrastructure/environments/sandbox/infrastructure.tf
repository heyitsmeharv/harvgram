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
  bucket_name            = var.bucket_name
  dynamodb_picture_table = module.dynamodb.dynamodb_picture_table
  ses_to_email_address   = var.ses_to_email_address
  ses_from_email_address = var.ses_from_email_address
  cognito_user_pool_id   = module.cognito.cognito_client_id
  frontend_url           = var.frontend_url
}

module "cognito" {
  source = "../../modules/cognito"
}

module "secrets" {
  source               = "../../modules/secrets_manager"
  cognito_user_pool_id = module.cognito.cognito_user_pool_id
  cognito_client_id    = module.cognito.cognito_client_id
}

module "network" {
  source = "../../modules/network"

  providers = {
    aws.virginia = aws.virginia
    aws.london   = aws.london
  }

  private_subnet_ids = module.network.private_subnet_ids
  security_groups = [
    module.ecs.frontend_sg_id,
    module.ecs.backend_sg_id
  ]

}

module "cloudfront" {
  source                  = "../../modules/cloudfront"
  domain_name             = var.frontend_url
  alb_dns_name            = module.network.alb_dns_name
  alb_zone_id             = module.network.alb_zone_id
  acm_certificate_arn     = module.network.acm_certificate_arn
  acm_certificate_api_arn = module.network.acm_certificate_api_arn
  bucket_name             = var.bucket_name
}

module "route53" {
  source             = "../../modules/route53"
  root_domain        = var.root_domain
  subdomain          = "www"
  target_domain_name = module.cloudfront.cloudfront_distribution_domain
  target_zone_id     = module.cloudfront.cloudfront_distribution_hosted_zone_id
  alb_dns_name       = module.network.alb_dns_name
  alb_zone_id        = module.network.alb_zone_id
}

module "ecs" {
  source                   = "../../modules/ecs"
  vpc_id                   = module.network.vpc_id
  public_subnet_ids        = module.network.public_subnet_ids
  private_subnet_ids       = module.network.private_subnet_ids
  frontend_subnet_cidrs    = module.network.frontend_subnet_cidrs
  alb_listener_arn         = module.network.alb_arn
  alb_sg_id                = module.network.alb_sg_id
  alb_tg_frontend_arn      = module.network.alb_tg_frontend_arn
  alb_tg_backend_arn       = module.network.alb_tg_backend_arn
  frontend_image_url       = module.ecr.frontend_image_url
  backend_image_url        = module.ecr.backend_image_url
  frontend_image_tag       = var.frontend_image_tag
  backend_image_tag        = var.backend_image_tag
  cognito_user_pool_id_arn = module.secrets.cognito_user_pool_id_arn
  cognito_client_id_arn    = module.secrets.cognito_client_id_arn
}
module "ecr" {
  source = "../../modules/ecr"
}

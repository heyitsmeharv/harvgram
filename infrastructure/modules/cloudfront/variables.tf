variable "domain_name" {
  default = "www.harvgram.co.uk"
  description = "custom domain for CloudFront"
  type        = string
}

variable "alb_dns_name" {
  description = "public DNS name of the ALB"
  type        = string
}

variable "alb_zone_id" {
  description = "zone ID of the ALB"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ACM cert in us-east-1"
  type        = string
}

variable "bucket_name" {
  description = "Name of the existing S3 bucket"
  type        = string
}
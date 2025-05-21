variable "root_domain" {
  description = "Root domain managed in Route 53"
  type        = string
}

variable "subdomain" {
  description = "Subdomain to create the record for (e.g. www)"
  type        = string
}

variable "target_domain_name" {
  description = "CloudFront distribution domain name"
  type        = string
}

variable "target_zone_id" {
  description = "CloudFront hosted zone ID"
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

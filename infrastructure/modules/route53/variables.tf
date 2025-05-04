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
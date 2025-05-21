resource "aws_route53_record" "frontend_alias" {
  zone_id = data.aws_route53_zone.root.zone_id
  name    = "${var.subdomain}.${var.root_domain}"
  type    = "A"

  alias {
    name                   = var.target_domain_name
    zone_id                = var.target_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "api" {
  name    = "api.harvgram.co.uk"
  type    = "A"
  zone_id = data.aws_route53_zone.root.zone_id

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}

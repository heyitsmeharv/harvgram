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
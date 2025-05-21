output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id,
    aws_subnet.public_c.id
  ]
}

output "private_subnet_ids" {
  value = [
    aws_subnet.private_a.id,
    aws_subnet.private_b.id,
    aws_subnet.private_c.id
  ]
}

output "frontend_subnet_cidrs" {
  value = [
    aws_subnet.public_a.cidr_block,
    aws_subnet.public_b.cidr_block,
    aws_subnet.public_b.cidr_block
  ]
}

output "alb_dns_name" {
  value = aws_lb.harvgram.dns_name
}

output "alb_zone_id" {
  value = aws_lb.harvgram.zone_id
}

output "alb_arn" {
  value = aws_lb.harvgram.arn
}

output "alb_listener_arn" {
  value = aws_lb_listener.http.arn
}

output "alb_sg_id" {
  value = aws_security_group.alb_sg.id
}

output "alb_tg_frontend_arn" {
  value = aws_lb_target_group.frontend.arn
}

output "alb_tg_backend_arn" {
  value = aws_lb_target_group.backend.arn
}

output "acm_certificate_arn" {
  value = data.aws_acm_certificate.auth_cert_virginia.arn
}
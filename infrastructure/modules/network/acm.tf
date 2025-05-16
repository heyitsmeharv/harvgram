data "aws_acm_certificate" "auth_cert" {
  domain   = "www.harvgram.co.uk"
  statuses = ["ISSUED"]
  most_recent = true
  provider = aws.london
}
data "aws_acm_certificate" "auth_cert_virginia" {
  domain   = "www.harvgram.co.uk"
  statuses = ["ISSUED"]
  most_recent = true
  provider = aws.virginia
}

data "aws_acm_certificate" "auth_cert_london" {
  domain   = "www.harvgram.co.uk"
  statuses = ["ISSUED"]
  most_recent = true
  provider = aws.london
}

data "aws_acm_certificate" "auth_cert_virginia_api" {
  domain   = "api.harvgram.co.uk"
  statuses = ["ISSUED"]
  most_recent = true
  provider = aws.virginia
}

data "aws_acm_certificate" "auth_cert_london_api" {
  domain   = "api.harvgram.co.uk"
  statuses = ["ISSUED"]
  most_recent = true
  provider = aws.london
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  default_root_object = "index.html"
  aliases             = [var.domain_name]

  origin {
    domain_name = var.alb_dns_name
    origin_id   = "alb-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "alb-origin"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  logging_config {
    bucket = "${var.bucket_name}.s3.amazonaws.com"
    prefix = "cloudfront/"
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["GB"]
    }
  }

  custom_error_response {
    error_code         = 500
    response_code      = 500
    response_page_path = "/errors/500.html"
  }

  custom_error_response {
    error_code         = 502
    response_code      = 502
    response_page_path = "/errors/502.html"
  }

  custom_error_response {
    error_code         = 503
    response_code      = 503
    response_page_path = "/errors/503.html"
  }

  custom_error_response {
    error_code         = 504
    response_code      = 504
    response_page_path = "/errors/504.html"
  }

  tags = {
    Name = "harvgram-cloudfront"
  }
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  default_root_object = "index.html"
  aliases             = [var.domain_name]

  # Frontend ECS via ALB
  origin {
    domain_name = var.alb_dns_name
    origin_id   = "frontend-alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Backend ECS via ALB (same ALB, different path)
  origin {
    domain_name = var.alb_dns_name
    origin_id   = "backend-alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # === CACHE BEHAVIORS ===

  # /api/* → backend ECS
  ordered_cache_behavior {
    path_pattern           = "/api/*"
    target_origin_id       = "backend-alb"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }

    compress = true
  }

  # Everything else → frontend ECS
  default_cache_behavior {
    target_origin_id       = "frontend-alb"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    compress = true
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

resource "aws_s3_object" "harvgram" {
  bucket = var.bucket_name
  key    = "frontend/"
}

resource "aws_s3_object" "picture_bucket" {
  bucket = var.bucket_name
  key    = "pictures/"
}

resource "aws_s3_bucket" "cloudfront_logs" {
  bucket = "harvgram-cloudfront-logs"

  tags = {
    Name = "harvgram-cloudfront-logs"
  }
}

resource "aws_s3_bucket_ownership_controls" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "cloudfront_logs" {
  depends_on = [aws_s3_bucket_ownership_controls.cloudfront_logs]
  bucket     = aws_s3_bucket.cloudfront_logs.id
  acl        = "log-delivery-write"
}

resource "aws_s3_bucket_policy" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "AWSCloudFrontLogsPolicy"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action = "s3:PutObject"
        Resource = "${aws_s3_bucket.cloudfront_logs.arn}/*"
      }
    ]
  })
}
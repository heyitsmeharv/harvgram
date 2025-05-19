output "cloudfront_s3_bucket" {
  value = aws_s3_bucket.cloudfront_logs.bucket
}
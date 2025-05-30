resource "aws_s3_object" "harvgram" {
  bucket = var.bucket_name
  key    = "frontend/"
}

resource "aws_s3_object" "picture_bucket" {
  bucket = var.bucket_name
  key    = "pictures/"
}

resource "aws_s3_object" "cloudfront" {
  bucket = var.bucket_name
  key    = "cloudfront/"
}

resource "aws_s3_object" "harvgram" {
  bucket = var.bucket_name
  key    = "frontend/"
}

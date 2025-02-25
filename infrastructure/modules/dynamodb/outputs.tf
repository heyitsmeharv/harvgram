output "dynamodb_picture_table" {
  value = aws_dynamodb_table.image_metadata.name
}
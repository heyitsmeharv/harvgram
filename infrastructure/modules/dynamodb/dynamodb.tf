resource "aws_dynamodb_table" "image_metadata" {
  name         = local.name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

   attribute {
    name = "date"
    type = "S"
  }

  global_secondary_index {
    name               = "date_index"
    hash_key           = "date"
    projection_type    = "KEYS_ONLY"
  }
}

data "template_file" "role_policy_lambda" {
  template = file("${path.module}/iam/policies/lambda_role_policy.json")
}

data "template_file" "assume_role_policy_lambda" {
  template = file("${path.module}/iam/roles/lambda_assume_role_policy.json")
}

data "archive_file" "get_picture_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../handlers/get_picture"
  output_path = "${path.root}/lambda_output/get_picture.zip"
}

data "archive_file" "upload_picture_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../handlers/upload_picture"
  output_path = "${path.root}/lambda_output/upload_picture.zip"
}

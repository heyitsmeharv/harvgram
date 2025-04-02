data "template_file" "role_policy_lambda" {
  template = file("${path.module}/iam/policies/lambda_role_policy.json")
}

data "template_file" "assume_role_policy_lambda" {
  template = file("${path.module}/iam/roles/lambda_assume_role_policy.json")
}

data "archive_file" "sign_up_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../handlers/sign_up"
  output_path = "${path.root}/lambda_output/sign_up.zip"
}

data "archive_file" "approve_user_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../handlers/approve_user"
  output_path = "${path.root}/lambda_output/approve_user.zip"
}

data "archive_file" "create_picture_entry_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../../handlers/create_picture_entry"
  output_path = "${path.root}/lambda_output/create_picture_entry.zip"
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

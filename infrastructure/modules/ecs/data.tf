data "template_file" "role_policy_ecs" {
  template = file("${path.module}/iam/policies/ecs_role_policy.json")
}

data "template_file" "assume_role_policy_ecs" {
  template = file("${path.module}/iam/roles/ecs_assume_role_policy.json")
}

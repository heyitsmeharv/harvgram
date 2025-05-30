resource "aws_iam_role" "ecs_role" {
  name               = "${local.name}_ecs_role"
  assume_role_policy = data.template_file.assume_role_policy_ecs.rendered
}

resource "aws_iam_role_policy" "ecs_role_policy" {
  role   = aws_iam_role.ecs_role.name
  policy = data.template_file.role_policy_ecs.rendered
}

resource "aws_cloudwatch_log_group" "ecs_frontend" {
  name              = "/ecs/harvgram-frontend"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "ecs_backend" {
  name              = "/ecs/harvgram-backend"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "harvgram-frontend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_role.arn
  task_role_arn            = aws_iam_role.ecs_role.arn
  container_definitions    = jsonencode(local.frontend_container_definition)
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "harvgram-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_role.arn
  task_role_arn            = aws_iam_role.ecs_role.arn
  container_definitions    = jsonencode(local.backend_container_definition)
}

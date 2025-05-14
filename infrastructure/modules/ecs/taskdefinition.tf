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

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = "${var.frontend_image_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ],
      log_configuration = {
        log_driver = "awslogs"
        options = {
          awslogs-region        = "eu-west-2"
          awslogs-group         = "/ecs/harvgram-frontend"
          awslogs-stream-prefix = "frontend"
        }
      }
    }
  ])
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "harvgram-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "${var.backend_image_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 5002
          hostPort      = 5002
          protocol      = "tcp"
        }
      ],
      log_configuration = {
        log_driver = "awslogs"
        options = {
          awslogs-region        = "eu-west-2"
          awslogs-group         = "/ecs/harvgram-backend"
          awslogs-stream-prefix = "backend"
        }
      }
    }
  ])
}

locals {
  branch = replace(basename(path.cwd), "_", "-")
  name   = "harvgram"
}

locals {
  frontend_container_definition = [
    {
      name      = "frontend"
      image     = "${var.frontend_image_url}:${var.frontend_image_tag}"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-region        = "eu-west-2"
          awslogs-group         = aws_cloudwatch_log_group.ecs_frontend.name
          awslogs-stream-prefix = "frontend"
        }
      }
    }
  ]
}

locals {
  backend_container_definition = [
    {
      name      = "backend"
      image     = "${var.backend_image_url}:${var.backend_image_tag}"
      essential = true
      portMappings = [
        {
          containerPort = 5002
          hostPort      = 5002
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-region        = "eu-west-2"
          awslogs-group         = aws_cloudwatch_log_group.ecs_backend.name
          awslogs-stream-prefix = "backend"
        }
      }
    }
  ]
}
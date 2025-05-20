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
      environment : [
        { "name" : "VITE_API_BASE_URL", "value" : "https://www.harvgram.co.uk/api/" }
      ]
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
      environment : [
        { "name" : "VITE_API_BASE_URL", "value" : "https://www.harvgram.co.uk/api/" },
        { "name" : "AWS_REGION", "value" : "eu-west-2" },
        { "name" : "UPLOAD_PICTURE_LAMBDA", "value" : "harvgram_create_picture_entry" },
        { "name" : "GET_PICTURES_LAMBDA", "value" : "harvgram_get_pictures" },
        { "name" : "DELETE_PICTURE_LAMBDA", "value" : "harvgram_delete_picture_entry" }
      ]
      secrets = [
        { name = "COGNITO_CLIENT_ID", valueFrom = var.cognito_client_id_arn },
        { name = "COGNITO_USER_POOL_ID", valueFrom = var.cognito_user_pool_id_arn }
      ]
    }
  ]
}

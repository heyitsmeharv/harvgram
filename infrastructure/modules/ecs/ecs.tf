resource "aws_ecs_cluster" "main" {
  name = "harvgram-cluster"
}

resource "aws_ecs_service" "frontend" {
  name                 = "frontend-service"
  cluster              = aws_ecs_cluster.main.id
  task_definition      = aws_ecs_task_definition.frontend.arn
  launch_type          = "FARGATE"
  desired_count        = 1
  force_new_deployment = true

  network_configuration {
    subnets          = [var.public_subnet_ids[0], var.public_subnet_ids[1], var.public_subnet_ids[2]]
    security_groups  = [aws_security_group.frontend_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = var.alb_tg_frontend_arn
    container_name   = "frontend"
    container_port   = 3000
  }

  depends_on = [var.alb_listener_arn]
}

resource "aws_ecs_service" "backend" {
  name                 = "backend-service"
  cluster              = aws_ecs_cluster.main.id
  task_definition      = aws_ecs_task_definition.backend.arn
  launch_type          = "FARGATE"
  desired_count        = 1
  force_new_deployment = true


  network_configuration {
    subnets          = [var.public_subnet_ids[0], var.public_subnet_ids[1], var.public_subnet_ids[2]]
    security_groups  = [aws_security_group.backend_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = var.alb_tg_backend_arn
    container_name   = "backend"
    container_port   = 5002
  }
}

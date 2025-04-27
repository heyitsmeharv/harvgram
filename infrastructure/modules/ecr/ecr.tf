resource "aws_ecr_repository" "backend_repo" {
  name = "harvgram-backend"
}

resource "aws_ecs_cluster" "main" {
  name = "harvgram-cluster"
}

resource "aws_security_group" "ecs_sg" {
  name   = "ecs-backend-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 5002
    to_port     = 5002
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

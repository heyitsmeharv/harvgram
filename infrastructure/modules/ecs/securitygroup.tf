resource "aws_security_group" "backend_sg" {
  name        = "harvgram-backend-sg"
  description = "Allow traffic only from frontend ECS"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5002
    to_port     = 5002
    protocol    = "tcp"
    cidr_blocks = var.frontend_subnet_cidrs  
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/16"]
  }

  tags = {
    Name = "backend-sg"
  }
}

resource "aws_security_group" "frontend_sg" {
  name        = "harvgram-frontend-sg"
  description = "Allow outbound to backend and inbound from ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [var.alb_sg_id]
  }

  egress {
    from_port       = 5002
    to_port         = 5002
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_sg.id]
  }

  tags = {
    Name = "frontend-sg"
  }
}

# Frontend ECS Security Group
resource "aws_security_group" "frontend_sg" {
  name        = "harvgram-frontend-sg"
  description = "Frontend ECS SG" # Allow ALB to talk to frontend ECS container
  vpc_id      = var.vpc_id

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # For ECR, etc.
  }

  tags = {
    Name = "frontend-sg"
  }
}

# Backend ECS Security Group
resource "aws_security_group" "backend_sg" {
  name        = "harvgram-backend-sg"
  description = "Backend ECS SG" # Allow ALB and frontend to talk to backend ECS container
  vpc_id      = var.vpc_id

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # For ECR, etc.
  }

  tags = {
    Name = "backend-sg"
  }
}

# Allow ALB to talk to frontend on port 3000
resource "aws_security_group_rule" "alb_to_frontend" {
  type                     = "ingress"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  security_group_id        = aws_security_group.frontend_sg.id
  source_security_group_id = var.alb_sg_id
}

# Allow ALB to talk to backend on port 5002
resource "aws_security_group_rule" "alb_to_backend" {
  type                     = "ingress"
  from_port                = 5002
  to_port                  = 5002
  protocol                 = "tcp"
  security_group_id        = aws_security_group.backend_sg.id
  source_security_group_id = var.alb_sg_id
}

# Allow frontend to talk to backend (optional, for SSR or internal calls)
resource "aws_security_group_rule" "frontend_to_backend" {
  type                     = "egress"
  from_port                = 5002
  to_port                  = 5002
  protocol                 = "tcp"
  security_group_id        = aws_security_group.frontend_sg.id
  source_security_group_id = aws_security_group.backend_sg.id
}
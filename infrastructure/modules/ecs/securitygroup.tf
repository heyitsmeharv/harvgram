resource "aws_security_group" "frontend_sg" {
  name        = "harvgram-frontend-sg"
  description = "Frontend ECS SG"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name = "frontend-sg"
  }
}

resource "aws_security_group" "backend_sg" {
  name        = "harvgram-backend-sg"
  description = "Backend ECS SG"
  vpc_id      = aws_vpc.main.id

  tags = {
    Name = "backend-sg"
  }
}

resource "aws_security_group_rule" "alb_to_frontend" {
  type                     = "ingress"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  security_group_id        = aws_security_group.frontend_sg.id
  source_security_group_id = var.alb_sg_id
}

resource "aws_security_group_rule" "frontend_to_backend" {
  type                     = "egress"
  from_port                = 5002
  to_port                  = 5002
  protocol                 = "tcp"
  security_group_id        = aws_security_group.frontend_sg.id
  source_security_group_id = aws_security_group.backend_sg.id
}

resource "aws_security_group_rule" "backend_from_frontend" {
  type                     = "ingress"
  from_port                = 5002
  to_port                  = 5002
  protocol                 = "tcp"
  security_group_id        = aws_security_group.backend_sg.id
  source_security_group_id = aws_security_group.frontend_sg.id
}

resource "aws_security_group_rule" "backend_to_frontend" {
  type                     = "egress"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  security_group_id        = aws_security_group.backend_sg.id
  source_security_group_id = aws_security_group.frontend_sg.id
}

resource "aws_security_group_rule" "frontend_from_backend" {
  type                     = "ingress"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  security_group_id        = aws_security_group.frontend_sg.id
  source_security_group_id = aws_security_group.backend_sg.id
}
# Frontend ECS Security Group
resource "aws_security_group" "frontend_sg" {
  name        = "harvgram-frontend-sg"
  description = "Frontend ECS SG" # Allow ALB to talk to frontend ECS container
  vpc_id      = var.vpc_id

  # Egress: allow HTTP (80), HTTPS (443), and DNS (53 UDP/TCP)
  egress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 53
    to_port     = 53
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 53
    to_port     = 53
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "frontend-sg" }
}

# Backend ECS Security Group
resource "aws_security_group" "backend_sg" {
  name        = "harvgram-backend-sg"
  description = "Backend ECS SG" # Allow ALB and frontend to talk to backend ECS container
  vpc_id      = var.vpc_id

  # Egress: allow HTTP (80), HTTPS (443), and DNS (53 UDP/TCP)
  egress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 53
    to_port     = 53
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 53
    to_port     = 53
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "backend-sg" }
}

# VPC Endpoint Security Group
resource "aws_security_group" "vpce_sg" {
  name        = "harvgram-vpce-sg"
  description = "Security group for all endpoints" 
  vpc_id      = var.vpc_id

  # Allow ECS tasks to call interface endpoints
  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_sg.id, aws_security_group.frontend_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "vpc-endpoint-sg" }
}

# ALB → ECS rules
resource "aws_security_group_rule" "alb_to_frontend" {
  type                     = "ingress"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  security_group_id        = aws_security_group.frontend_sg.id
  source_security_group_id = var.alb_sg_id
}
resource "aws_security_group_rule" "alb_to_backend" {
  type                     = "ingress"
  from_port                = 5002
  to_port                  = 5002
  protocol                 = "tcp"
  security_group_id        = aws_security_group.backend_sg.id
  source_security_group_id = var.alb_sg_id
}

# Frontend → Backend (optional)
resource "aws_security_group_rule" "frontend_to_backend" {
  type                     = "egress"
  from_port                = 5002
  to_port                  = 5002
  protocol                 = "tcp"
  security_group_id        = aws_security_group.frontend_sg.id
  source_security_group_id = aws_security_group.backend_sg.id
}

# VPC Interface Endpoints
# resource "aws_vpc_endpoint" "ecr_api" {
#   vpc_id               = var.vpc_id
#   service_name         = "com.amazonaws.${var.aws_region}.ecr.api"
#   vpc_endpoint_type    = "Interface"
#   subnet_ids           = var.private_subnet_ids
#   security_group_ids   = [aws_security_group.vpce_sg.id]
#   private_dns_enabled  = true
# }
# resource "aws_vpc_endpoint" "ecr_dkr" {
#   vpc_id               = var.vpc_id
#   service_name         = "com.amazonaws.${var.aws_region}.ecr.dkr"
#   vpc_endpoint_type    = "Interface"
#   subnet_ids           = var.private_subnet_ids
#   security_group_ids   = [aws_security_group.vpce_sg.id]
#   private_dns_enabled  = true
# }
# resource "aws_vpc_endpoint" "secretsmanager" {
#   vpc_id               = var.vpc_id
#   service_name         = "com.amazonaws.${var.aws_region}.secretsmanager"
#   vpc_endpoint_type    = "Interface"
#   subnet_ids           = var.private_subnet_ids
#   security_group_ids   = [aws_security_group.vpce_sg.id]
#   private_dns_enabled  = true
# }

variable "vpc_id" {
  description = "VPC id"
  type        = string
}

variable "public_subnet_ids" {
  description = "public subnet ids"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "private subnets ids"
  type        = list(string)
}

variable "frontend_subnet_cidrs" {
  description = "cidr ranges for frontend"
  type        = list(string)
}

variable "alb_listener_arn" {
  description = "application load balancer listener arn"
  type        = string
}

variable "alb_sg_id" {
  description = "application load balancer security group"
  type        = string
}

variable "alb_tg_frontend_arn" {
  description = "application load balancer target group for frontend"
  type        = string
}

variable "alb_tg_backend_arn" {
  description = "application load balancer target group for backend"
  type        = string
}

variable "frontend_image_url" {
  description = "ECR URL for frontend"
  type        = string
}

variable "backend_image_url" {
  description = "ECR URL for backend"
  type        = string
}


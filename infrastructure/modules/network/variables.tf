variable "private_subnet_ids" {
  description = "list of private subnet ids"
  type        = list(string)
}

variable "security_groups" {
  description = "frontend and backend security groups"
  type        = list(string)
}
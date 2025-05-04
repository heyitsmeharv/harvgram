output "frontend_image_url" {
  value = aws_ecr_repository.frontend.repository_url
}

output "backend_image_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "frontend_image_debug" {
  value = var.frontend_image_tag
}

output "backend_image_debug" {
  value = var.backend_image_tag
}

output "front_end_image_uri_debug" {
  value = "${module.ecr.frontend_image_url}:${var.frontend_image_tag}"
}

output "back_end_image_uri_debug" {
  value = "${module.ecr.backend_image_url}:${var.backend_image_tag}"
}
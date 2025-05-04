resource "aws_ecr_repository" "frontend" {
  name = "harvgram-frontend"
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "backend" {
  name = "harvgram-backend"
  image_scanning_configuration {
    scan_on_push = true
  }
}
locals {
  branch = replace(basename(path.cwd), "_", "-")
  name = "harvgram"
}
terraform {
  backend "s3" {
    bucket               = "to-tf-state-bucket"
    region               = "us-east-2"
    use_lockfile         = true
    encrypt              = true
    workspace_key_prefix = "env"               # folder prefix
    key                  = "terraform.tfstate" # constant filename
  }
}

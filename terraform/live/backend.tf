terraform {
  backend "s3" {
    bucket               = "to-tf-state-bucket"
    key                  = "terraform.tfstate"
    workspace_key_prefix = "env"
    region               = "us-east-2"
    encrypt              = true

    # ✅ S3 native locking
    use_lockfile = true
  }
}

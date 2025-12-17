project     = "netflix_clone"
key_name    = "kp"
admin_cidrs = ["0.0.0.0/0"]

vpc_cidr = "10.0.0.0/16"
azs      = ["us-east-2a", "us-east-2b"]

public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnets = ["10.0.11.0/24", "10.0.12.0/24"]

tags = {
  Owner   = "Terrence"
  Project = "netflix_clone"
}

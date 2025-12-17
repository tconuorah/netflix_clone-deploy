
variable "region" {
  type    = string
  default = "us-east-2"
}
variable "project" { type = string }
variable "key_name" { type = string }
variable "admin_cidrs" { type = list(string) }

variable "vpc_cidr" { type = string }
variable "azs" { type = list(string) }
variable "public_subnets" { type = list(string) }
variable "private_subnets" { type = list(string) }

variable "tags" { type = map(string) }
